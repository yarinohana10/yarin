import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { WeddingDetailsForm } from '@/components/admin/WeddingDetailsForm';
import { useWeddingStore } from '@/lib/store';
import { WeddingStats } from '@/components/admin/WeddingStats';
import { GuestsManagement } from '@/components/admin/GuestsManagement';
import { LoadingState } from '@/components/admin/LoadingState';

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateWeddingDetails } = useWeddingStore();
  
  const [weddingDetails, setWeddingDetails] = useState({
    id: '',
    coupleNames: '',
    weddingDate: '',
    venueName: '',
    venueAddress: '',
    venueMapLink: '',
    wazeLink: '',
    bitNumber: '',
    bankNumber: '',
    bankBranch: '',
    bankAccountNumber: '',
    bankAccountHolder: '',
    backgroundImage: '',
  });
  
  const [guestStats, setGuestStats] = useState({
    total: 0,
    attending: 0,
    declined: 0,
    maybe: 0,
    pending: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSignOut = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/auth');
  };
  
  const fetchWeddingDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const weddingData = data[0];
        const details = {
          id: weddingData.id,
          coupleNames: weddingData.couple_names,
          weddingDate: weddingData.wedding_date,
          venueName: weddingData.venue_name,
          venueAddress: weddingData.venue_address,
          venueMapLink: weddingData.venue_map_link || '',
          wazeLink: weddingData.waze_link || '',
          bitNumber: weddingData.bit_number || '',
          bankNumber: weddingData.bank_number || '',
          bankBranch: weddingData.bank_branch || '',
          bankAccountNumber: weddingData.bank_account_number || '',
          bankAccountHolder: weddingData.bank_account_holder || '',
          backgroundImage: weddingData.background_image || '',
        };
        
        setWeddingDetails(details);
        updateWeddingDetails({
          coupleNames: details.coupleNames,
          weddingDate: details.weddingDate,
          venueName: details.venueName,
          venueAddress: details.venueAddress,
          venueMapLink: details.venueMapLink,
          wazeLink: details.wazeLink,
          bitNumber: details.bitNumber,
          bankNumber: details.bankNumber,
          bankBranch: details.bankBranch,
          bankAccountNumber: details.bankAccountNumber,
          bankAccountHolder: details.bankAccountHolder,
          backgroundImage: details.backgroundImage,
        });
      }
    } catch (error: any) {
      console.error('Error fetching wedding details:', error);
      toast({
        title: 'שגיאה בטעינת פרטי החתונה',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchGuestStats = async () => {
    if (!weddingDetails.id) return;
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('status, guest_count')
        .eq('wedding_id', weddingDetails.id);
      
      if (error) throw error;
      
      if (data) {
        const stats = {
          total: data.reduce((sum, guest) => sum + (guest.guest_count || 1), 0),
          attending: data
            .filter(g => g.status === 'attending')
            .reduce((sum, guest) => sum + (guest.guest_count || 1), 0),
          declined: data
            .filter(g => g.status === 'declined')
            .reduce((sum, guest) => sum + (guest.guest_count || 1), 0),
          maybe: data
            .filter(g => g.status === 'maybe')
            .reduce((sum, guest) => sum + (guest.guest_count || 1), 0),
          pending: data
            .filter(g => g.status === 'pending')
            .reduce((sum, guest) => sum + (guest.guest_count || 1), 0),
        };
        
        setGuestStats(stats);
      }
    } catch (error) {
      console.error('Error fetching guest stats:', error);
    }
  };
  
  const handleRefresh = () => {
    fetchGuestStats();
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleUpdateWeddingDetails = async (updatedDetails: any) => {
    if (!weddingDetails.id) return;
    
    try {
      console.log("Updating wedding details:", updatedDetails);
      
      const { error } = await supabase
        .from('wedding_events')
        .update({
          couple_names: updatedDetails.coupleNames,
          wedding_date: updatedDetails.weddingDate,
          venue_name: updatedDetails.venueName,
          venue_address: updatedDetails.venueAddress,
          venue_map_link: updatedDetails.venueMapLink,
          waze_link: updatedDetails.wazeLink,
          bit_number: updatedDetails.bitNumber,
          bank_number: updatedDetails.bankNumber,
          bank_branch: updatedDetails.bankBranch,
          bank_account_number: updatedDetails.bankAccountNumber,
          bank_account_holder: updatedDetails.bankAccountHolder,
          background_image: updatedDetails.backgroundImage,
        })
        .eq('id', weddingDetails.id);
      
      if (error) throw error;
      
      setWeddingDetails({
        ...weddingDetails,
        ...updatedDetails
      });
      
      updateWeddingDetails({
        coupleNames: updatedDetails.coupleNames,
        weddingDate: updatedDetails.weddingDate,
        venueName: updatedDetails.venueName,
        venueAddress: updatedDetails.venueAddress,
        venueMapLink: updatedDetails.venueMapLink,
        wazeLink: updatedDetails.wazeLink,
        bitNumber: updatedDetails.bitNumber,
        bankNumber: updatedDetails.bankNumber,
        bankBranch: updatedDetails.bankBranch,
        bankAccountNumber: updatedDetails.bankAccountNumber,
        bankAccountHolder: updatedDetails.bankAccountHolder,
        backgroundImage: updatedDetails.backgroundImage,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating wedding details:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    fetchWeddingDetails();
  }, []);
  
  useEffect(() => {
    if (weddingDetails.id) {
      fetchGuestStats();
    }
  }, [weddingDetails.id, refreshTrigger]);
  
  if (loading) {
    return <LoadingState />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AdminHeader onSignOut={handleSignOut} />
        
        {weddingDetails.id && <WeddingStats guestStats={guestStats} />}
        
        <Tabs defaultValue="guests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="guests" className="flex gap-2">
              <Users className="h-4 w-4" />
              אישורי הגעה
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex gap-2">
              <Settings className="h-4 w-4" />
              הגדרות
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guests">
            <GuestsManagement 
              weddingId={weddingDetails.id} 
              onRefresh={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <WeddingDetailsForm 
              weddingDetails={weddingDetails}
              onUpdate={handleUpdateWeddingDetails}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
