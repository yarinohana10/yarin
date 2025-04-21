
import { useState, useEffect } from 'react';
import { useWeddingStore } from '@/lib/store';
import { GoogleCalendarButton, formatGoogleCalendarUrl } from './GoogleCalendarButton';

export const MapLinks = () => {
  const { weddingDetails } = useWeddingStore();
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationError("לא ניתן לאתר את מיקומך הנוכחי.");
        }
      );
    } else {
      setLocationError("הדפדפן שלך לא תומך באיתור מיקום.");
    }
  }, []);

  // Updated coordinates for Doria Hall, Hemi Yoav
  const venueCoordinates = {
    lat: 31.6309,
    lng: 34.7880
  };

  const venueName = "אולמי דוריה, חמי יואב";

  const createGoogleMapsUrl = () => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${venueCoordinates.lat},${venueCoordinates.lng}&destination_place_id=ChIJOQHGGOE7HRURKhA4CxRtsTg`;
    } else {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName)}&query=${venueCoordinates.lat},${venueCoordinates.lng}`;
    }
  };

  const createWazeUrl = () => {
    return `https://waze.com/ul?ll=${venueCoordinates.lat},${venueCoordinates.lng}&navigate=yes&z=10&q=${encodeURIComponent(venueName)}`;
  };

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(venueName)}&center=${venueCoordinates.lat},${venueCoordinates.lng}&zoom=12`;

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="rounded-lg overflow-hidden shadow-md">
        <div className="relative">
          <div className="bg-gray-200 aspect-video w-full flex items-center justify-center overflow-hidden">
            {locationError ? (
              <div className="text-center p-4 text-gray-600">
                <p>{locationError}</p>
              </div>
            ) : (
              <iframe 
                title="מפת האולם"
                src={mapSrc}
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: "200px" }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md p-3 min-w-60 text-center">
            <p className="font-semibold text-gray-700 mb-1">אולמי דוריה, חמי יואב</p>
            <p className="text-blue-500 text-sm">הצג מפה גדולה יותר</p>
          </div>
        </div>
        
        <div className="flex flex-col">
          <a 
            href={createWazeUrl()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#e4c28d] text-center py-3 flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.5C6.204 1.5 1.5 6.204 1.5 12S6.204 22.5 12 22.5 22.5 17.796 22.5 12 17.796 1.5 12 1.5zM9.997 18.037c-.216.458-.722.709-1.238.569-.516-.141-.786-.627-.614-1.102.173-.475.727-.752 1.241-.616.515.135.828.69.611 1.149zm8.244-8.792c-.443 2.075-1.298 4.033-2.232 5.81-1.064 2.017-2.263 3.193-4.083 3.779-1.687.544-3.139-.212-3.925-1.777-.784-1.564-.403-3.076.759-4.271.703-.727 1.598-1.212 2.564-1.551.364-.127.731-.228 1.096-.34.254-.077.413.008.469.269.056.262-.072.403-.312.48-.416.133-.839.25-1.244.413-1.125.453-1.817 1.313-1.957 2.527-.13 1.132.316 1.986 1.337 2.545.88.48 1.821.48 2.752.146 1.199-.43 2.185-1.289 2.937-2.301.868-1.167 1.562-2.46 2.118-3.82.184-.451.366-.905.477-1.383.068-.295-.016-.545-.28-.686-.328-.173-.79-.135-1.139.101-.427.289-.75.681-1.029 1.113-.254.393-.477.808-.715 1.212-.071.121-.143.263-.291.264-.109.006-.204-.1-.241-.203-.087-.244-.101-.497-.022-.777.036-.127.107-.254.182-.366.542-.804 1.143-1.564 1.933-2.144.541-.396 1.143-.607 1.815-.589.559.015 1.047.236 1.42.671.375.436.458.937.406 1.483z" />
            </svg>
            ניווט עם Waze
          </a>
          
          <a 
            href={createGoogleMapsUrl()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#e4c28d] text-center py-3 border-t border-[#d4b37d] flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
              <path d="M10.3 7.7L11.7 6.3 15.4 10 11.7 13.7 10.3 12.3 12.6 10z" />
            </svg>
            ניווט עם Google Maps
          </a>
          
          <div className="bg-[#e4c28d] text-center py-3 border-t border-[#d4b37d] flex items-center justify-center hover:opacity-90 transition-opacity rounded-b-lg">
            <a 
              href={formatGoogleCalendarUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-2V3c0-.55-.45-1-1-1s-1 .45-1 1v1H9V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h2v1c0 .55.45 1 1 1s1-.45 1-1V6h6v1c0 .55.45 1 1 1s1-.45 1-1V6h2v2H5z" />
              </svg>
              הוסף ליומן Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
