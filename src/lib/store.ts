
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define types for our store
interface WeddingDetails {
  id?: string;
  coupleNames: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  venueMapLink: string;
  wazeLink: string;
  bitNumber: string;
  // Bank details
  bankNumber: string;
  bankBranch: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  backgroundImage: string;
}

interface GuestInfo {
  attending: boolean | null;
  phoneNumber?: string;
  mealPreference?: string;
}

interface WeddingStore {
  weddingDetails: WeddingDetails;
  guestRSVPs: Record<string, GuestInfo>; // Map of guest name to their RSVP status and details
  updateWeddingDetails: (details: Partial<WeddingDetails>) => void;
  updateRSVP: (guestName: string, attending: boolean | null, phoneNumber?: string, mealPreference?: string) => void;
}

// Create the store with default values
export const useWeddingStore = create<WeddingStore>()(
  persist(
    (set) => ({
      weddingDetails: {
        coupleNames: 'ליאן & אלי',
        weddingDate: '2026-11-03T19:00:00',
        weddingTime: '19:00',
        venueName: 'מידאה אולם אירועים',
        venueAddress: 'פאור סנטר, אשקלון',
        venueMapLink: 'https://www.google.com/maps/place/%D7%9E%D7%99%D7%93%D7%90%D7%94+%D7%90%D7%95%D7%9C%D7%9D+%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D/@31.6745371,34.6053521,17z',
        wazeLink: 'https://www.waze.com/ul?ll=31.6745371,34.6053521&navigate=yes&zoom=17',
        bitNumber: '',
        bankNumber: '',
        bankBranch: '',
        bankAccountNumber: '',
        bankAccountHolder: '',
        backgroundImage: '',
      },
      guestRSVPs: {},
      updateWeddingDetails: (details) => 
        set((state) => ({
          weddingDetails: {
            ...state.weddingDetails,
            ...details,
          },
        })),
      updateRSVP: (guestName, attending, phoneNumber, mealPreference) =>
        set((state) => ({
          guestRSVPs: {
            ...state.guestRSVPs,
            [guestName]: {
              attending,
              phoneNumber,
              mealPreference: mealPreference || 'רגיל',
            },
          },
        })),
    }),
    {
      name: 'hinna-storage',
    }
  )
);
