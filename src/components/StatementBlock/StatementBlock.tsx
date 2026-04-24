import { useEffect, useRef, useState, type ReactNode } from 'react';
import './StatementBlock.css';

/* ─────────────────────── Data Model ─────────────────────── */

interface TextSegment {
  text: string;
  highlight: boolean;
}

interface Statement {
  number: string;
  segments: TextSegment[];
  botComment?: string;
}

const seg = (text: string, highlight = false): TextSegment => ({ text, highlight });

const statements: Statement[] = [
  {
    number: '01',
    segments: [
      seg('Making '),
      seg('AI', true),
      seg(' system safer, more honest, and harder to misuse. '),
      // seg('- making language models safer, more honest, and harder to misuse.')
    ],
  },
  {
    number: '02',
    segments: [
      seg('From '),
      seg('watermarking', true),
      seg(' generated text to'),
      seg(' evaluating hallucinations', true),
      seg(' in multimodal systems.'),
      seg(' My research asks: '),
      seg(' how do we know when to trust a model ?')
    ],
    botComment: 'Clean. Ship it.',
  },
  {
    number: '03',
    segments: [
      seg("I don't treat"),
      seg(" safety", true),
      seg(" as a constraint on capability."),
      seg(" I treat it as the "),
      seg(" hardest research problem", true),
      seg(" worth solving.")
      // seg("I don't just build models. I build "),
      // seg('trust', true),
      // seg('. Welcome to my research.'),
    ],
  },
];

/* ──────────────────── Single Scroll-Driven Statement ──────────────────── */

interface ScrollStatementProps {
  statement: Statement;
  index: number;
}

function ScrollStatement({ statement }: ScrollStatementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → 1 (typing only)

  const totalChars = statement.segments.reduce((sum, s) => sum + s.text.length, 0);
  const charsToShow = Math.floor(progress * totalChars);
  const isTyping = progress > 0 && progress < 1;
  const isDone = progress >= 1;

  // What fraction of the total scroll range is used for typing vs holding
  const TYPING_PHASE = 0.55; // First 55% of scroll = typing
  // Remaining 45% = hold (text stays visible before scrolling away)

  // Scroll-driven progress calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // The full scroll range of this container
      const scrollStart = rect.top + viewportHeight * 0.4;
      const scrollEnd = rect.top + containerHeight - viewportHeight;
      const totalRange = scrollEnd - scrollStart;

      if (totalRange <= 0) {
        setProgress(rect.top < viewportHeight * 0.5 ? 1 : 0);
        return;
      }

      const scrolled = -scrollStart;
      const rawPct = Math.max(0, Math.min(1, scrolled / totalRange));

      // Map only the typing phase (0 → TYPING_PHASE) to progress (0 → 1)
      const typingPct = Math.max(0, Math.min(1, rawPct / TYPING_PHASE));
      setProgress(typingPct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render typed text up to charsToShow
  const renderTypedText = (): ReactNode[] => {
    let remaining = charsToShow;
    const elements: ReactNode[] = [];

    for (let i = 0; i < statement.segments.length; i++) {
      const segment = statement.segments[i];
      if (remaining <= 0) break;

      const visible = Math.min(remaining, segment.text.length);
      const visibleText = segment.text.slice(0, visible);
      remaining -= visible;

      if (segment.highlight) {
        elements.push(<em key={i}>{visibleText}</em>);
      } else {
        elements.push(<span key={i}>{visibleText}</span>);
      }
    }

    return elements;
  };

  return (
    <div className="scroll-statement-container" ref={containerRef}>
      <div className="scroll-statement-sticky">
        {/* Number label */}
        <span className={`statement-number ${progress > 0 ? 'show' : ''}`}>
          {statement.number}
        </span>

        {/* Editor frame wraps the text during typing */}
        <div className={`statement-editor-wrapper ${isTyping ? 'typing' : ''} ${isDone ? 'done' : ''}`}>
          {/* Figma label */}
          <div className={`statement-editor-label ${isTyping ? 'show' : ''}`}>
            p / Statement {statement.number}
          </div>
          {/* Figma border */}
          <div className={`statement-editor-border ${isTyping ? 'show' : ''}`} />

          {/* The text */}
          <p className="statement-text">
            {renderTypedText()}
            {isTyping && <span className="statement-cursor" />}
          </p>
        </div>

        {/* "content → editing..." status near cursor */}
        <div className={`statement-editing-status ${isTyping ? 'show' : ''}`}>
          <svg className="statement-status-cursor-icon" viewBox="0 0 16 16" fill="none">
            <path d="M1 1L6.5 14L8.5 8.5L14 6.5L1 1Z" />
          </svg>
          <span className="statement-status-label">content → writing...</span>
        </div>

        {/* Bot comment after typing completes */}
        {statement.botComment && (
          <div className={`statement-bot-comment ${isDone ? 'show' : ''}`}>
            <svg className="statement-bot-cursor-icon" viewBox="0 0 16 16" fill="none">
              <path d="M1 1L6.5 14L8.5 8.5L14 6.5L1 1Z" />
            </svg>
            <span className="statement-bot-label">Mohit M.</span>
            <span className="statement-bot-bubble">{statement.botComment}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────── Main Section Component ────────────────── */

export default function StatementBlock() {
  return (
    <section className="statement-section" id="statement-section">
      {statements.map((stmt, i) => (
        <div key={i}>
          {i > 0 && <div className="statement-divider" />}
          <ScrollStatement statement={stmt} index={i} />
        </div>
      ))}
    </section>
  );
}
