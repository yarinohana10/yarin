
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Guest } from '@/components/guests/types';

export const useGuests = (weddingId: string | undefined, status: string) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGuests = async () => {
    if (!weddingId) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('guests')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('created_at', { ascending: false });
        
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setGuests(data as Guest[]);
      }
    } catch (error: any) {
      console.error('Error fetching guests:', error);
      toast({
        title: 'שגיאה בטעינת רשימת האורחים',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!weddingId || !guestId) {
      console.error('Missing required parameters: weddingId or guestId');
      return false;
    }
    
    try {
      console.log('Executing deletion for guest ID:', guestId, 'and wedding ID:', weddingId);
      
      // Using more specific query with both ID and wedding_id
      const { error, count } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId)
        .eq('wedding_id', weddingId);
        
      if (error) {
        console.error('Error from Supabase when deleting:', error);
        throw error;
      }
      
      console.log('Guest deletion completed, affected rows:', count);
      
      // Update local state after successful deletion
      setGuests(prev => prev.filter(guest => guest.id !== guestId));
      
      toast({
        title: 'האורח נמחק בהצלחה',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      toast({
        title: 'שגיאה במחיקת האורח',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (weddingId) {
      fetchGuests();
    }
  }, [weddingId, status]);

  return {
    guests,
    loading,
    fetchGuests,
    handleDeleteGuest
  };
};
