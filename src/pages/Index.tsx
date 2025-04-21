
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { Link } from 'react-router-dom';
import { Settings, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/Countdown';
import { RSVPButtons } from '@/components/RSVPButtons';
import { MapLinks } from '@/components/MapLinks';
import { BitPayment } from '@/components/BitPayment';
import { useWeddingStore } from '@/lib/store';
import { Confetti } from '@/components/Confetti';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { weddingDetails, updateWeddingDetails } = useWeddingStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('wedding_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const weddingData = data[0];
          updateWeddingDetails({
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
            backgroundImage: weddingData.background_image || '/lovable-uploads/5e2b1d00-93e9-43a5-a19a-6d625b2e97af.png',
          });
        }
      } catch (error) {
        console.error('Error fetching wedding details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeddingDetails();
  }, [updateWeddingDetails]);
  
  const weddingDate = new Date(weddingDetails.weddingDate);
  const formattedDate = formatInTimeZone(
    weddingDate,
    'Asia/Jerusalem',
    "EEEE, d בMMMM yyyy", 
    { locale: he }
  );
  
  const backgroundStyle = {
    backgroundImage: weddingDetails.backgroundImage
      ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${weddingDetails.backgroundImage})`
      : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(/lovable-uploads/5e2b1d00-93e9-43a5-a19a-6d625b2e97af.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F5F2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0B6BC]"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#F9F5F2]" 
      style={backgroundStyle}
    >
      <Confetti />
      
      <div className="absolute top-6 left-6 z-10">
        <Link to="/admin">
          <Button variant="outline" size="icon" className="bg-white/90 hover:bg-white backdrop-blur-sm">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full space-y-8">
          <div className="wedding-card p-8 md:p-10 text-center animate-fadeIn">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px bg-[#D4AF7A] flex-1 max-w-[100px]"></div>
              <img 
                src="/lovable-uploads/e4fbc1e4-4b39-4040-b949-bbf0d6692f2f.png" 
                alt="O & Y Monogram" 
                className="mx-4 h-16 w-16 object-contain"
              />
              <div className="h-px bg-[#D4AF7A] flex-1 max-w-[100px]"></div>
            </div>
            
            <h1 className="wedding-title mb-4 uppercase">
              ORAN &amp; YARIN
            </h1>
            <p className="wedding-subtitle uppercase font-bold">ARE GETTING MARRIED</p>
            
            <Separator className="my-4 bg-[#D4AF7A]/30" />
            
            <p className="wedding-subtitle mb-6 mt-4">נרגשים להזמינכם לחגוג איתנו את היום המאושר בחיינו</p>
            <p className="mb-2 text-xl font-semibold">א' בסיוון התשפ"ה</p>
            <p className="mb-6 text-xl">27.05.2025</p>
            <p className="mb-6 text-xl">{weddingDetails.venueName}, {weddingDetails.venueAddress}</p>
            
            <div className="flex flex-row justify-center gap-12 my-4">
              <div className="flex flex-col items-center justify-center text-lg">
                <span>קבלת פנים</span>
                <Clock className="h-5 w-5 text-[#333333] mx-2 my-1" />
                <span>19:30</span>
              </div>
              <div className="flex flex-col items-center justify-center text-lg">
                <span className="text-[#333333]">חופה וקידושין</span>
                <Heart className="h-5 w-5 text-[#333333] mx-2 my-1 bg-white/0" />
                <span className="text-[#333333]">20:30</span>
              </div>
            </div>
            
            <div className="mt-8 border-t border-[#D4AF7A]/30 pt-6">
              <RSVPButtons />
            </div>
          </div>
          
          <Countdown />
          
          <MapLinks />
          
          <div className="wedding-card">
            <BitPayment />
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-white bg-black/40 backdrop-blur-sm">
        <p className="text-sm">
          oran &amp; yarin | {format(weddingDate, 'dd.MM.yyyy')}
        </p>
      </footer>
    </div>
  );
};

export default Index;
