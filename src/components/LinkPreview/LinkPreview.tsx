import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './LinkPreview.css';

interface LinkPreviewProps {
  children: ReactNode;
  href: string;
}

/**
 * Aceternity-style link preview using microlink.io for live screenshots.
 * Signature Aceternity UI animation: The card smoothly follows the mouse cursor with a slight tilt.
 * Includes edge collision detection to prevent the card from getting cut off on small screens.
 */
export default function LinkPreview({
  children,
  href,
}: LinkPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for the cursor-tracking animation
  const x = useMotionValue(0);

  // Spring physics matching Aceternity UI's smooth tracking feel
  const springConfig = { stiffness: 180, damping: 15, mass: 0.5 };
  const translateX = useSpring(x, springConfig);

  // Map the X translation to a slight 3D rotation for that premium feel
  const rotate = useTransform(x, [-100, 100], [-8, 8]);
  const rotateSpring = useSpring(rotate, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (!isHovered) return;
    
    // Calculate cursor offset relative to the center of the link wrapper
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    let offsetFromCenter = eventOffsetX - targetRect.width / 2;
    
    // -- Edge Collision Detection --
    // The CSS positions the card at left: 50% with margin-left: -125px (for a 250px wide card).
    // So the card's center aligns with the link's center, plus our offsetFromCenter.
    // The absolute screen X coordinate of the card's center is:
    const cardCenterScreenX = targetRect.left + targetRect.width / 2 + offsetFromCenter;
    const cardHalfWidth = 125;
    
    // Check if the left edge goes off-screen
    if (cardCenterScreenX - cardHalfWidth < 10) {
      const difference = Math.abs(cardCenterScreenX - cardHalfWidth) + 10;
      offsetFromCenter += difference;
    } 
    // Check if the right edge goes off-screen
    else if (cardCenterScreenX + cardHalfWidth > window.innerWidth - 10) {
      const difference = (cardCenterScreenX + cardHalfWidth) - (window.innerWidth - 10);
      offsetFromCenter -= difference;
    }

    // Update motion value with the bounded offset
    x.set(offsetFromCenter);
  };

  // microlink.io free API — fetches a live screenshot of any URL
  const previewSrc = `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=false&embed=screenshot.url&type=png&viewport.width=1280&viewport.height=720`;

  return (
    <span
      className="link-preview-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <a
        className="link-preview-trigger"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>

      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="link-preview-card"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ 
              x: translateX,
              rotate: rotateSpring
            }}
            aria-hidden="true"
          >
            <img
              className="link-preview-image"
              src={previewSrc}
              alt="Website preview"
              loading="eager"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
