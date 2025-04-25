import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useWeddingStore } from '@/lib/store';

export const Countdown = () => {
  const { weddingDetails } = useWeddingStore();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const weddingDate = new Date(weddingDetails.weddingDate);
      const now = new Date();
      
      if (weddingDate <= now) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: differenceInDays(weddingDate, now),
        hours: differenceInHours(weddingDate, now) % 24,
        minutes: differenceInMinutes(weddingDate, now) % 60,
        seconds: differenceInSeconds(weddingDate, now) % 60
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [weddingDetails.weddingDate]);

  // Reverse the order of time units (seconds, minutes, hours, days) for RTL display
  const timeUnits = [
    { label: 'שניות', value: timeLeft.seconds },
    { label: 'דקות', value: timeLeft.minutes },
    { label: 'שעות', value: timeLeft.hours },
    { label: 'ימים', value: timeLeft.days }
  ];

  return (
    <div className="flex flex-nowrap justify-center gap-1 sm:gap-2 md:gap-4 mb-6 sm:mb-8 mt-2 sm:mt-4 overflow-x-auto px-1 sm:px-2">
      {timeUnits.map((unit) => (
        <Card key={unit.label} className="w-16 sm:w-20 md:w-24 bg-white/90 shadow-md flex-shrink-0 transition-all duration-300">
          <CardContent className="p-2 md:p-3 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#D4AF7A]">{unit.value}</div>
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">{unit.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
