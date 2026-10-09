import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
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
      : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(/assets/background.png)`,
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
                src="/assets/le-logo.svg"
                alt="Henna logo"
                className="mx-4 h-18 w-18 object-contain"
                style={{ height: "68px", width: "68px" }}
              />
              <div className="h-px bg-[hsl(0,0%,78%)] flex-1 max-w-[100px]"></div>
            </div>

            <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A2E] " style={{ fontFamily: 'oswald' }}>
              LIAN & ELI
            </h1>
            <p className="mb-4 text-lg md:text-xl font-bold text-[#1A1A2E] font-heebo">
              THE HENNA
            </p>

            <Separator className="my-4 bg-[#D4AF7A]/30" />

            <p className="mb-6 mt-4 text-[#333333] text-base md:text-lg font-heebo">
              שמחים להזמינכם לחגוג עמנו את
              <br />
              טקס החינה שלנו
            </p>
            <p className="mb-2 text-lg md:text-xl font-semibold text-[#333333] font-heebo">יום שלישי, כ"ג בחשוון תשפ"ז</p>
            <p className="mb-6 text-lg md:text-xl text-[#333333] font-heebo ">
              <span className='font-bold'>03.11.2026</span>
            </p>
            <p className="mb-2 text-lg md:text-xl text-[#333333] font-heebo">אולמי "MEDEA" | מתחם "פאור סנטר", אשקלון</p>
            <p className="mb-6 text-base md:text-lg font-semibold text-[#333333] font-heebo">בשעה 19:30</p>

            <div className="flex flex-row justify-center gap-8 md:gap-16 my-4 font-heebo text-sm md:text-base">
              <div className="flex flex-col items-center text-center">
                <span className="font-semibold text-[#333333]">הורי החתן</span>
                <span className="text-[#555555]">דרור ושרה בוזגלו</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-semibold text-[#333333]">הורי הכלה</span>
                <span className="text-[#555555]">אליעזר וטלי מכלוף</span>
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
          LIAN &amp; ELI | {format(weddingDate, 'dd.MM.yyyy')}
        </p>
      </footer>
    </div>
  );
};

export default Index;
