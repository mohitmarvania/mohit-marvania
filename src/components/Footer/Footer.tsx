import { useEffect, useRef, useState, useCallback } from 'react';
import './Footer.css';

/* ──────────────── Constants ──────────────── */

const EMAIL = 'mohitmarvania@gmail.com'; // ← update with your real email

const BOT_MESSAGES = [
  'Copied to clipboard!',
  'Got it — email copied!',
  'All yours — just paste it!',
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/mohitmarvania' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mohit-marvania' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/' },
  { label: 'Twitter / X', href: 'https://x.com/' },
];

/* ──────────────── Component ──────────────── */

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [copied, setCopied] = useState(false);
  const [botVisible, setBotVisible] = useState(false);
  const [botMessage, setBotMessage] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [botPos, setBotPos] = useState({ x: 0, y: 0 });
  const copyCountRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();

  /* ─── Scroll-reveal ─── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ─── Copy to clipboard ─── */
  const handleCopy = useCallback(async () => {
    // Copy to clipboard (works on all devices)
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    // Visual feedback
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Position bot cursor relative to the wrapper (not the section)
    if (emailRef.current && wrapperRef.current) {
      const emailRect = emailRef.current.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      // Place cursor just to the right of the email button, vertically centered
      const x = emailRect.right - wrapperRect.left + 12;
      const y = emailRect.top - wrapperRect.top + emailRect.height * 0.3;
      setBotPos({ x, y });
    }

    // Pick message (cycle through)
    const msgIndex = copyCountRef.current % BOT_MESSAGES.length;
    copyCountRef.current++;
    setBotMessage(BOT_MESSAGES[msgIndex]);
    setBotVisible(true);

    // Clear any pending hide timer and set new one
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setBotVisible(false), 3500);
  }, []);

  /* ─── Typewriter for bot message ─── */
  useEffect(() => {
    if (!botVisible || !botMessage) {
      setTypedMessage('');
      return;
    }

    setTypedMessage('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedMessage(botMessage.slice(0, i));
      if (i >= botMessage.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [botVisible, botMessage]);

  return (
    <footer
      className={`footer ${inView ? 'in-view' : ''}`}
      id="footer"
      ref={sectionRef}
    >
      <div className="footer__inner">
        {/* ─── CTA Block ─── */}
        <div className="footer__cta-block">
          <h2 className="footer__cta-heading">
            <span className="footer__cta-solid">Let's</span>
            <span className="footer__cta-outline">Collaborate.</span>
          </h2>

          {/* Email — click to copy */}
          <div className="footer__email-wrapper" ref={wrapperRef}>
            <button
              ref={emailRef}
              className={`footer__email ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy email address"
            >
              {EMAIL}
            </button>
            <span className="footer__email-hint">Click to copy</span>

            {/* Local bot cursor that appears on copy */}
            <div
              className={`footer__bot-cursor ${botVisible ? 'visible' : ''}`}
              style={{
                left: `${botPos.x}px`,
                top: `${botPos.y}px`,
              }}
            >
              <div className="footer__bot-pointer">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 1L6.5 14L8.5 8.5L14 6.5L1 1Z"
                    fill="#8B5CF6"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <div className="footer__bot-label">Mohit M.</div>
              <div className={`footer__bot-bubble ${botVisible && typedMessage ? 'visible' : ''}`}>
                {typedMessage}<span style={{ opacity: 0.5 }}>|</span>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                className="footer__social-link"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <span className="footer__bottom-left-solid">Mohit</span>
            <span className="footer__bottom-left-outline">Marvania</span>
          </div>
          <div className="footer__bottom-right">
            <a className="footer__bottom-link" href="/research">Research</a>
            <a className="footer__bottom-link" href="/about">About</a>
            <span className="footer__copyright">© 2026 Mohit Marvania. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
