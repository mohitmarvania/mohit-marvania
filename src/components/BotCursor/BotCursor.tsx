import { useState, useEffect, useRef, useCallback } from 'react';
import './BotCursor.css';

interface BotCursorProps {
  targetX: number;
  targetY: number;
  visible: boolean;
  message: string;
  showMessage: boolean;
  /** When set, the bot cursor jumps immediately to this position before animating */
  initialPosition?: { x: number; y: number } | null;
}

export default function BotCursor({
  targetX,
  targetY,
  visible,
  message,
  showMessage,
  initialPosition,
}: BotCursorProps) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [typedMessage, setTypedMessage] = useState('');
  const animFrameRef = useRef<number>(0);
  const currentPos = useRef({ x: -100, y: -100 });
  const hasInitialized = useRef(false);

  // When initialPosition changes, snap the cursor there immediately
  useEffect(() => {
    if (initialPosition && visible) {
      currentPos.current = { x: initialPosition.x, y: initialPosition.y };
      setPos({ x: initialPosition.x, y: initialPosition.y });
      hasInitialized.current = true;
    }
  }, [initialPosition, visible]);

  // Reset when hidden
  useEffect(() => {
    if (!visible) {
      hasInitialized.current = false;
      currentPos.current = { x: -100, y: -100 };
    }
  }, [visible]);

  // Smooth movement toward target using lerp
  const animate = useCallback(() => {
    const dx = targetX - currentPos.current.x;
    const dy = targetY - currentPos.current.y;
    const speed = 0.14; // Fast enough to stay close to the text during drag-back

    currentPos.current.x += dx * speed;
    currentPos.current.y += dy * speed;

    setPos({ x: currentPos.current.x, y: currentPos.current.y });

    animFrameRef.current = requestAnimationFrame(animate);
  }, [targetX, targetY]);

  useEffect(() => {
    if (visible) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [visible, animate]);

  // Typewriter effect for message
  useEffect(() => {
    if (!showMessage || !message) {
      setTypedMessage('');
      return;
    }

    setTypedMessage('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedMessage(message.slice(0, i));
      if (i >= message.length) clearInterval(interval);
    }, 35);

    return () => clearInterval(interval);
  }, [message, showMessage]);

  if (!visible) return null;

  return (
    <div
      className="bot-cursor"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
    >
      <div className="bot-cursor-pointer">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 1L6.5 14L8.5 8.5L14 6.5L1 1Z"
            fill="#8B5CF6"
            stroke="#ffffff"
            strokeWidth="1"
          />
        </svg>
      </div>
      <div className="bot-cursor-label">Mohit M.</div>
      <div className={`bot-cursor-bubble ${showMessage && typedMessage ? 'visible' : ''}`}>
        {typedMessage}<span style={{ opacity: 0.5 }}>|</span>
      </div>
    </div>
  );
}
