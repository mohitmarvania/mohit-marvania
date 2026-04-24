import { useState, useEffect, useCallback } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'counting' | 'exiting' | 'hidden'>('counting');

  const handleExit = useCallback(() => {
    setPhase('exiting');
    setTimeout(() => {
      setPhase('hidden');
      onComplete();
    }, 800);
  }, [onComplete]);

  useEffect(() => {
    if (phase !== 'counting') return;

    const duration = 2500; // total duration in ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Ease-out curve: fast start, slow at end
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      const value = Math.round(eased * 100);
      
      setProgress(value);

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setTimeout(handleExit, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [phase, handleExit]);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`loading-screen ${phase === 'exiting' ? 'exiting' : ''}`}
      id="loading-screen"
    >
      <span className="loading-counter">{progress}%</span>
    </div>
  );
}
