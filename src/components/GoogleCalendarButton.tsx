
import { Calendar } from 'lucide-react';
import { useWeddingStore } from '@/lib/store';

// Export this function separately
export const formatGoogleCalendarUrl = () => {
  const { weddingDetails } = useWeddingStore();
  
  // Parse the wedding date and time
  const weddingDate = new Date(weddingDetails.weddingDate);
  
  // Start and end times (assuming event lasts 5 hours)
  const startTime = new Date(weddingDate);
  startTime.setHours(19, 30, 0); // Reception at 19:30
  
  const endTime = new Date(weddingDate);
  endTime.setHours(24, 30, 0); // End time (5 hours later)
  
  // Format dates for the URL
  const start = startTime.toISOString().replace(/-|:|\.\d+/g, '');
  const end = endTime.toISOString().replace(/-|:|\.\d+/g, '');
  
  // Create the event title and details
  const title = `חתונה של ירין & אוראן`;
  const details = `קבלת פנים\n19:30\nחופה וקידושין\n20:30`;
  const location = `${weddingDetails.venueName}, ${weddingDetails.venueAddress}`;
  
  // Build the Google Calendar URL
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
};

export const GoogleCalendarButton = () => {
  return (
    <a 
      href={formatGoogleCalendarUrl()} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-[#e4c28d] text-center py-3 flex items-center justify-center hover:opacity-90 transition-opacity rounded-b-lg"
    >
      <Calendar className="mr-2 h-5 w-5" />
      הוסף ליומן Google
    </a>
  );
};
