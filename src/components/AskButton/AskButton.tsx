import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { QA_DATABASE, TOPIC_CARDS, QUICK_CHIPS } from '../../data/askData';
import type { QAItem } from '../../data/askData';
import './AskButton.css';

/* ──────────── Fuzzy Search ──────────── */
function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  // Simple substring + keyword matching
  if (t.includes(q)) return true;
  // Check if all query words appear somewhere in target
  const words = q.split(/\s+/);
  return words.every(w => t.includes(w));
}

/* ──────────── Markdown-lite parser (bold + links) ──────────── */
function renderAnswer(text: string) {
  // Split on **bold** and [text](url) markers
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="palette-answer-link">
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ──────────── Component ──────────── */

interface AskButtonProps {
  visible: boolean;
}

export default function AskButton({ visible }: AskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingRef = useRef<number>(0);

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        if (selectedQA) {
          // Go back to search instead of closing
          setSelectedQA(null);
          setTypedAnswer('');
          cancelAnimationFrame(typingRef.current);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedQA]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedQA(null);
      setTypedAnswer('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  // ─── Filtered results ───
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return QA_DATABASE.filter(item =>
      fuzzyMatch(query, item.question) || fuzzyMatch(query, item.answer)
    ).slice(0, 8);
  }, [query]);

  // Reset active index when results change
  useEffect(() => { setActiveIndex(0); }, [results]);

  // ─── Select a question ───
  const selectQuestion = useCallback((qa: QAItem) => {
    setSelectedQA(qa);
    setTypedAnswer('');
    setIsTyping(true);

    // Typewriter effect
    let i = 0;
    const fullText = qa.answer;
    const speed = 8; // ms per character

    function typeChar() {
      if (i < fullText.length) {
        setTypedAnswer(fullText.slice(0, i + 1));
        i++;
        typingRef.current = window.setTimeout(typeChar, speed) as unknown as number;
      } else {
        setIsTyping(false);
      }
    }
    typeChar();
  }, []);

  // ─── Select by ID ───
  const selectById = useCallback((id: string) => {
    const qa = QA_DATABASE.find(item => item.id === id);
    if (qa) selectQuestion(qa);
  }, [selectQuestion]);



  // ─── Back from answer ───
  const goBack = useCallback(() => {
    setSelectedQA(null);
    setTypedAnswer('');
    setIsTyping(false);
    clearTimeout(typingRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // ─── Close on overlay click ───
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('palette-overlay')) {
      setIsOpen(false);
    }
  }, []);

  const showHome = !query.trim() && !selectedQA;

  return (
    <>
      {/* Trigger Button */}
      <button
        className={`ask-button ${visible ? 'visible' : ''}`}
        id="ask-button"
        aria-label="Ask about my work"
        onClick={() => setIsOpen(true)}
      >
        <span className="ask-button-icon">✦</span>
        Ask my work
        <span className="ask-button-shortcut">⌘K</span>
      </button>

      {/* Palette Overlay */}
      <div
        className={`palette-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={handleOverlayClick}
      >
        <div className="palette" role="dialog" aria-modal="true">

          {/* ─── HOME VIEW (topic cards + chips) ─── */}
          {showHome && (
            <>
              <div className="palette-header">
                <h2 className="palette-heading">How can I help you today?</h2>
                <div className="palette-topics">
                  {TOPIC_CARDS.map(card => (
                    <div
                      key={card.triggerQuestionId}
                      className="palette-topic-card"
                      style={{ background: card.color }}
                      onClick={() => selectById(card.triggerQuestionId)}
                    >
                      <div className="palette-topic-top">
                        <span className="palette-topic-emoji">{card.emoji}</span>
                        <span className="palette-topic-arrow">↗</span>
                      </div>
                      <span className="palette-topic-title">{card.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="palette-chips-section">
                <div className="palette-chips-label">TRENDING</div>
                <div className="palette-chips">
                  {QUICK_CHIPS.map(chip => (
                    <button
                      key={chip.triggerQuestionId}
                      className="palette-chip"
                      onClick={() => selectById(chip.triggerQuestionId)}
                    >
                      <span className="palette-chip-emoji">{chip.emoji}</span>
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ─── SEARCH RESULTS ─── */}
          {query.trim() && !selectedQA && (
            <div className="palette-results">
              {results.length > 0 ? (
                results.map((result, i) => (
                  <div
                    key={result.id}
                    className={`palette-result ${i === activeIndex ? 'is-active' : ''}`}
                    onClick={() => selectQuestion(result)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <span className="palette-result-emoji">{result.emoji}</span>
                    <span className="palette-result-text">{result.question}</span>
                    <span className="palette-result-category">{result.category}</span>
                  </div>
                ))
              ) : (
                <div className="palette-result">
                  <span className="palette-result-emoji">🤷</span>
                  <span className="palette-result-text" style={{ color: 'var(--color-text-tertiary)' }}>
                    No pre-written answer for that — try a different question or reach out directly!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ─── ANSWER VIEW ─── */}
          {selectedQA && (
            <div className="palette-answer-view">
              <div className="palette-answer-back" onClick={goBack}>
                ← Back
              </div>
              <div className="palette-answer-question">{selectedQA.question}</div>
              <div className="palette-answer-text">
                {renderAnswer(typedAnswer)}
                {isTyping && <span className="typing-cursor" />}
              </div>
            </div>
          )}



          {/* ─── FOOTER ─── */}
          <div className="palette-footer">
            <span className="palette-footer-text">
            No AI was charged for this conversation ⚡ · 100% hand-crafted answers
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
