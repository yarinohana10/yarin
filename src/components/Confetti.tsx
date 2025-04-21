
import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export const Confetti = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000); // Show confetti for 8 seconds

    return () => clearTimeout(timer);
  }, []);

  return showConfetti ? (
    <ReactConfetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.1}
      colors={['#F0B6BC', '#E8D7C3', '#D4AF7A', '#FFD1DC', '#FFEFD5']}
    />
  ) : null;
};
