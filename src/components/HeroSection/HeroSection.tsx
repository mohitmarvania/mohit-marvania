import { useState, useRef, useCallback, useEffect } from 'react';
import BotCursor from '../BotCursor/BotCursor';
import './HeroSection.css';

interface HeroSectionProps {
  visible: boolean;
}

type InteractionPhase =
  | 'idle'
  | 'dragging'
  | 'displaced'
  | 'bot-dragging-back'
  | 'commenting'
  | 'done';

// 3 comment variations that cycle on each drag
const BOT_COMMENTS = [
  "Back to optimal. Let's keep the loss at zero.",
  "bruhhh.. stop breaking my layout.",
  "Gradient correction applied. Stay centered.",
];

const STATUS_LABELS = [
  "Optimizing position...",
  "Aligning to Grid...",
  "Minimizing displacement...",
];

export default function HeroSection({ visible }: HeroSectionProps) {
  const [phase, setPhase] = useState<InteractionPhase>('idle');
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [subtitleText, setSubtitleText] = useState('');
  const [showSubtitleField, setShowSubtitleField] = useState(false);

  const nameRef = useRef<HTMLDivElement>(null);
  const nameOriginRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const hasInteracted = useRef(false);
  const subtitleTyped = useRef(false);
  const commentIndex = useRef(0);
  const animFrameRef = useRef<number>(0);

  // Bot cursor state
  const [botVisible, setBotVisible] = useState(false);
  const [botTarget, setBotTarget] = useState({ x: 0, y: 0 });
  const [botInitialPos, setBotInitialPos] = useState<{ x: number; y: number } | null>(null);
  const [botMessage, setBotMessage] = useState('');
  const [showBotMessage, setShowBotMessage] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');
  const [statusLabelPos, setStatusLabelPos] = useState({ x: 0, y: 0 });

  // Store the displaced offset so the bot can animate the text back
  const displacedOffset = useRef({ x: 0, y: 0 });

  // Type the subtitle after hero becomes visible (if not already done through drag)
  useEffect(() => {
    if (!visible || subtitleTyped.current) return;
    
    const timer = setTimeout(() => {
      if (!hasInteracted.current) {
        typeSubtitle();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [visible]);

  const typeSubtitle = useCallback(() => {
    if (subtitleTyped.current) return;
    subtitleTyped.current = true;

    setShowSubtitleField(true);
    const text = 'Precision in research, rigor in every experiment.';
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setSubtitleText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 40);
  }, []);

  // Get the center position of the name WRAPPER (this is the ORIGIN, it never moves)
  const getWrapperCenter = useCallback(() => {
    if (!nameRef.current) return { x: 0, y: 0 };
    const rect = nameRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  // DRAG START
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (phase !== 'idle' && phase !== 'done') return;
    e.preventDefault();
    isDragging.current = true;
    hasInteracted.current = true;

    const center = getWrapperCenter();
    nameOriginRef.current = { x: center.x, y: center.y };
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    setPhase('dragging');
    
    // Clear previous state
    cancelAnimationFrame(animFrameRef.current);
    setBotVisible(false);
    setShowBotMessage(false);
    setStatusLabel('');
    setBotInitialPos(null);
  }, [phase, offset, getWrapperCenter]);

  // DRAG MOVE
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setOffset({ x: newX, y: newY });
  }, [dragStart]);

  // DRAG END — The main interaction sequence
  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const dx = Math.round(offset.x);
    const dy = Math.round(offset.y);

    // Only trigger bot if displaced significantly
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      setOffset({ x: 0, y: 0 });
      setPhase('idle');
      return;
    }

    // Save the current displaced offset
    displacedOffset.current = { x: offset.x, y: offset.y };
    setPhase('displaced');

    // The wrapper center is the ORIGINAL position (never moves)
    const wrapperCenter = getWrapperCenter();
    
    // The DISPLACED text position = wrapper center + current offset
    const displacedTextCenter = {
      x: wrapperCenter.x + offset.x,
      y: wrapperCenter.y + offset.y,
    };
    
    // Get the current comment/status index
    const idx = commentIndex.current % BOT_COMMENTS.length;

    // Step 1: After a short pause, spawn bot cursor AT the displaced text position
    setTimeout(() => {
      // Bot appears right next to the DISPLACED text (where it actually is on screen)
      const botSpawnPos = {
        x: displacedTextCenter.x + 50,
        y: displacedTextCenter.y - 25,
      };
      setBotInitialPos(botSpawnPos);
      setBotTarget(botSpawnPos); // Hold here initially
      setBotVisible(true);

      // Step 2: After bot appears, start dragging back
      setTimeout(() => {
        setPhase('bot-dragging-back');
        setStatusLabel(STATUS_LABELS[idx]);

        // Position status label above the ORIGINAL position
        setStatusLabelPos({
          x: wrapperCenter.x,
          y: wrapperCenter.y - 100,
        });

        // Animate text AND bot together back to origin
        const animDuration = 1400; // ms
        const startTime = Date.now();
        const startOff = { ...displacedOffset.current };

        const animateBack = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / animDuration, 1);
          // Ease out cubic for smooth deceleration
          const eased = 1 - Math.pow(1 - progress, 3);

          const currentX = startOff.x * (1 - eased);
          const currentY = startOff.y * (1 - eased);

          // Move the text
          setOffset({ x: currentX, y: currentY });

          // Move the bot cursor to stay next to the text as it moves
          setBotTarget({
            x: wrapperCenter.x + currentX + 50,
            y: wrapperCenter.y + currentY - 25,
          });

          if (progress < 1) {
            animFrameRef.current = requestAnimationFrame(animateBack);
          } else {
            // Text has arrived at origin
            setOffset({ x: 0, y: 0 });
            setBotTarget({
              x: wrapperCenter.x + 50,
              y: wrapperCenter.y - 25,
            });

            // Step 3: Show comment
            setTimeout(() => {
              setPhase('commenting');
              setStatusLabel('');
              setBotMessage(BOT_COMMENTS[idx]);
              setShowBotMessage(true);

              // Increment for next time
              commentIndex.current++;

              // Step 4: After message completes, clean up
              setTimeout(() => {
                setPhase('done');
                setShowBotMessage(false);
                setBotVisible(false);
                setBotInitialPos(null);

                // Type subtitle if not yet done
                if (!subtitleTyped.current) {
                  typeSubtitle();
                }
              }, 3000);
            }, 400);
          }
        };

        animFrameRef.current = requestAnimationFrame(animateBack);
      }, 500); // Pause after bot appears before it starts dragging

    }, 350); // Pause after user releases before bot appears

  }, [offset, getWrapperCenter, typeSubtitle]);

  // Global mouse events for dragging
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <section className="hero" id="hero-section">
      {/* Dot grid background */}
      <div className="hero-dot-grid" />

      {/* Tagline */}
      <p className={`hero-tagline ${visible ? 'visible' : ''}`}>
        EXPLORING THE BOUNDARIES OF MACHINE INTELLIGENCE.
      </p>

      {/* Name */}
      <div className={`hero-name-container ${visible ? 'visible' : ''}`}>
        {/* Draggable first name */}
        <div
          className={`hero-firstname-wrapper ${phase === 'dragging' ? 'dragging' : ''}`}
          ref={nameRef}
        >
          <div className="hero-drag-label">DRAG TO MOVE</div>
          <div className="hero-selection-box" />
          <h1
            className="hero-firstname"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px)`,
            }}
            onMouseDown={handleMouseDown}
          >
            MOHIT
          </h1>
        </div>

        {/* Outlined last name */}
        <span className="hero-lastname">MARVANIA</span>
      </div>

      {/* Status label (Optimizing position...) */}
      {statusLabel && (
        <div
          className="hero-status-label aligning visible"
          style={{
            left: `${statusLabelPos.x}px`,
            top: `${statusLabelPos.y}px`,
          }}
        >
          {statusLabel}
        </div>
      )}

      {/* Bot cursor */}
      <BotCursor
        targetX={botTarget.x}
        targetY={botTarget.y}
        visible={botVisible}
        message={botMessage}
        showMessage={showBotMessage}
        initialPosition={botInitialPos}
      />

      {/* Subtitle typing field */}
      <div className={`hero-subtitle-field ${visible ? 'visible' : ''}`}>
        {showSubtitleField && (
          <>
            <div className="hero-subtitle-field-label">p / Subtitle</div>
            <div className="hero-subtitle-field-box">
              <span className="hero-subtitle-field-text">{subtitleText}</span>
              <span className="hero-subtitle-field-caret" />
            </div>
          </>
        )}
        {!showSubtitleField && (
          <p className="hero-subtitle-field-text" style={{ opacity: 0 }}>
            Precision in research, rigor in every experiment.
          </p>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="arrow" />
      </div>
    </section>
  );
}
