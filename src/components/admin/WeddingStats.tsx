
import { GuestStats } from '@/components/GuestStats';

type WeddingStatsProps = {
  guestStats: {
    total: number;
    attending: number;
    declined: number;
    maybe: number;
    pending: number;
  };
};

export const WeddingStats = ({ guestStats }: WeddingStatsProps) => {
  return (
    <div className="mb-6">
      <GuestStats stats={guestStats} />
    </div>
  );
};
