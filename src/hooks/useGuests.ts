
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
    try {
      // Validate inputs
      if (!weddingId || !guestId) {
        throw new Error('Missing required parameters: weddingId or guestId');
      }
      
      console.log('Deleting guest:', guestId, 'from wedding ID:', weddingId);
      
      // Execute the delete operation with explicit wedding_id check
      const { error, data } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId)
        .eq('wedding_id', weddingId);
      
      if (error) {
        console.error('Supabase deletion error:', error);
        throw error;
      }
      
      
      // Update local state after successful deletion
      setGuests(prev => prev.filter(guest => guest.id !== guestId));
      
      toast({
        title: 'האורח נמחק בהצלחה',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error in handleDeleteGuest:', error);
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
