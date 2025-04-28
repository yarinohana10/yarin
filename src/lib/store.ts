
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
        coupleNames: 'ירין & אוראן',
        weddingDate: '2025-05-27T19:00:00',
        weddingTime: '19:00',
        venueName: 'אולמי דוריה',
        venueAddress: 'חמי יואב',
        venueMapLink: 'https://maps.app.goo.gl/bCwkYKKQqU2JM8PV6',
        wazeLink: ' https://waze.com/ul/hsv8sj2f2d',
        bitNumber: '',
        bankNumber: '',
        bankBranch: '',
        bankAccountNumber: '',
        bankAccountHolder: '',
        backgroundImage: '/lovable-uploads/c9313de6-ff70-4b11-9d08-40b1cab40910.png',
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
      name: 'wedding-storage',
    }
  )
);
