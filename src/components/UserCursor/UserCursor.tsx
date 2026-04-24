import { useRef, useEffect, useState } from 'react';
import './UserCursor.css';

interface UserCursorProps {
  visible: boolean;
}

export default function UserCursor({ visible }: UserCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [isHoverCapable, setIsHoverCapable] = useState(true);

  useEffect(() => {
    // Check if the device has a mouse/pointer. We don't want this on mobile touch screens.
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsHoverCapable(mql.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsHoverCapable(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isHoverCapable) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      posRef.current.x += dx * 0.15;
      posRef.current.y += dy * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${posRef.current.x}px`;
        cursorRef.current.style.top = `${posRef.current.y}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible || !isHoverCapable) return null;

  return (
    <div
      className="user-cursor"
      ref={cursorRef}
      id="user-cursor"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 1L6.5 14L8.5 8.5L14 6.5L1 1Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1"
        />
      </svg>
      <div className="user-cursor-label">You</div>
    </div>
  );
}
