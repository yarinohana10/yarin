
export type Guest = {
  id: string;
  full_name: string;
  phone_number: string | null;
  status: 'attending' | 'declined' | 'maybe' | 'pending';
  guest_count: number;
  meal_preference: string | null;
  created_at: string;
  updated_at: string;
};
