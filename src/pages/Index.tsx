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
            id: weddingData.id,
            coupleNames: weddingData.couple_names,
            weddingDate: weddingData.wedding_date,
            venueName: weddingData.venue_address,
            venueAddress: weddingData.venue_name,
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
      className="min-h-screen flex flex-col bg-[#F9F5F2] font-heebo"
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

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full space-y-6 md:space-y-8">
          <div className="wedding-card p-6 md:p-8 lg:p-10 text-center animate-fadeIn bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="absolute top-4 right-4 text-sm text-right">
              בס"ד
            </div>
            <div className="flex justify-center items-center mb-6">
              <div className="h-px bg-[hsl(0,0%,78%)] flex-1 max-w-[100px]"></div>
              <img
                src="/lovable-uploads/994e3256-15d1-42d2-bdb8-1d09b9cc4927.png"
                alt="Wedding logo"
                className="mx-4 h-18 w-18 object-contain"
                style={{ height: "68px", width: "68px" }}
              />
              <div className="h-px bg-[hsl(0,0%,78%)] flex-1 max-w-[100px]"></div>
            </div>

            <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A2E] " style={{ fontFamily: 'oswald' }}>
              ORAN & YARIN
            </h1>
            <p className="mb-4 text-lg md:text-xl font-bold text-[#1A1A2E] font-heebo">
              ARE GETTING MARRIED
            </p>

            <Separator className="my-4 bg-[#D4AF7A]/30" />

            <p className="mb-6 mt-4 text-[#333333] text-base md:text-lg font-heebo">
              נרגשים להזמינכם לחגוג איתנו את היום המאושר בחיינו
            </p>
            <p className="mb-2 text-lg md:text-xl font-semibold text-[#333333] font-heebo">א' בסיוון התשפ"ה</p>
            <p className="mb-6 text-lg md:text-xl text-[#333333] font-heebo ">
              <span className='font-bold'>27.05.2025</span>
            </p>
            <p className="mb-6 text-lg md:text-xl text-[#333333] font-heebo">{weddingDetails.venueName}, {weddingDetails.venueAddress}</p>

            <div className="flex flex-row justify-center gap-6 md:gap-12 my-4 font-heebo">
              <div className="flex flex-col items-center justify-center text-base md:text-lg">
                <span className="text-[#333333] font-heebo">קבלת פנים</span>
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-[#333333] mx-2 my-1" />
                <span className="text-[#333333] font-heebo">19:30</span>
              </div>
              <div className="flex flex-col items-center justify-center text-base md:text-lg">
                <span className="text-[#333333] font-heebo">חופה וקידושין</span>
                <Heart className="h-4 w-4 md:h-5 md:w-5 text-[#333333] mx-2 my-1 bg-white/0" />
                <span className="text-[#333333] font-heebo">20:30</span>
              </div>
            </div>

            <div className="mt-8 border-t border-[#D4AF7A]/30 pt-6">
              <RSVPButtons />
            </div>
          </div>

          <Countdown />

          <MapLinks />

          <div className="wedding-card bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <BitPayment />
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-white bg-black/40 backdrop-blur-sm font-heebo">
        <p className="text-xs md:text-sm font-heebo">
          ORAN &amp; YARIN | {format(weddingDate, 'dd.MM.yyyy')}
        </p>
      </footer>
    </div>
  );
};

export default Index;
