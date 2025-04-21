
import { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Home } from 'lucide-react';
import { useWeddingStore } from '@/lib/store';
import { GoogleCalendarButton } from '@/components/GoogleCalendarButton';

const ThankYou = () => {
  const location = useLocation();
  const { weddingDetails } = useWeddingStore();
  
  // Get attendance status from location state
  const { attending } = location.state || {};
  
  // If accessed directly without state, redirect to homepage
  if (attending === undefined) {
    return <Navigate to="/" />;
  }
  
  // Background style with the uploaded image
  const backgroundStyle = {
    backgroundImage: weddingDetails.backgroundImage 
      ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${weddingDetails.backgroundImage})` 
      : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(/lovable-uploads/5e2b1d00-93e9-43a5-a19a-6d625b2e97af.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4" 
      style={backgroundStyle}
    >
      {/* "Back to home" button for all attendance statuses */}
      <div className="absolute top-4 right-4">
        <Link to="/">
          <Button variant="outline" className="bg-white/90 hover:bg-gray-100">
            <Home className="h-4 w-4 ml-2" />
            חזרה לעמוד הבית
          </Button>
        </Link>
      </div>
      
      <Card className="max-w-md w-full bg-white/95 shadow-xl">
        <CardContent className="p-8 text-center">
          {attending === 'attending' ? (
            <>
              <h2 className="text-2xl font-bold text-[#F0B6BC] mb-4">
                תודה על אישור ההגעה!
              </h2>
              <p className="text-lg mb-6">
                נתראה בשמחה
                <br />
                oran & yarin
              </p>
              
              {/* Google Calendar Button */}
              <div className="mt-6 w-full">
                <GoogleCalendarButton />
              </div>
            </>
          ) : attending === 'maybe' ? (
            <>
              <h2 className="text-2xl font-bold text-[#f0b95a] mb-4">
                תודה על העדכון!
              </h2>
              <p className="text-lg mb-6">
                נשמח לראותך
                <br />
                oran & yarin
              </p>
              
              {/* Google Calendar Button for 'maybe' attendees too */}
              <div className="mt-6 w-full">
                <GoogleCalendarButton />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                תודה רבה על העדכון
              </h2>
              <p className="text-lg mb-6">
                נשמח לראותך באירועים הבאים
                <br />
                oran & yarin
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;
