import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import featuredResearch from '../../data/featuredResearch';
import type { FeaturedResearchItem } from '../../data/featuredResearch';
import './FeaturedResearch.css';

/** Only show items marked as featured, capped at 3 for the Home Page scroll cards */
const homeFeatured = featuredResearch.filter(item => item.featured).slice(0, 3);

/* ──────────────── Single Research Card ──────────────── */

interface CardProps {
  item: FeaturedResearchItem;
  index: number;
  /** Floating-point "active index" driven by scroll. E.g. 1.4 means 40% through card 1→2 transition */
  activeIndex: number;
  cardCount: number;
}

function ResearchCard({ item, index, activeIndex, cardCount }: CardProps) {
  /*
   * offset = how far this card is from being the "current" card.
   *   offset <  0  → card hasn't appeared yet (below viewport)
   *   offset  0-1  → card is the primary active card
   *   offset >  1  → card has been scrolled past
   */
  const offset = activeIndex - index;

  /* ─── Enter: slide up from below ─── */
  // First card is always "entered", others slide in when offset goes from -0.3 → 0
  const enterT = index === 0
    ? 1
    : Math.max(0, Math.min(1, (offset + 0.3) / 0.3));

  /* ─── Exit: scale down + blur (when next card pushes this one back) ─── */
  const exitT = index === cardCount - 1
    ? 0 // last card never exits
    : Math.max(0, Math.min(1, (offset - 0.7) / 0.3));

  /* ─── Transforms ─── */
  const translateY = (1 - enterT) * 100;        // 100% to 0%
  const scale = 1 - exitT * 0.08;               // 1 → 0.92
  const blur = exitT * 8;                        // 0px → 8px
  const opacity = enterT;                        // 0 → 1 on enter

  /* ─── Z-index: newer cards always on top ─── */
  const zIndex = offset > -0.5 ? index + 1 : 0;



  /* Hide cards that are way out of range */
  const shouldRender = offset > -0.6 && offset < 2;
  if (!shouldRender) return null;

  return (
    <article
      className="fr-card"
      style={{
        zIndex,
        transform: `translateY(${translateY}%) scale(${scale})`,
        filter: blur > 0.1 ? `blur(${blur}px)` : 'none',
        opacity,
      }}
    >
      {/* Left — Text Content */}
      <div className="fr-card__text">
        <div>
          {item.statusTag && (
            <div className={`global-status-pill color-${item.statusTag.color}`} style={{ marginBottom: '16px' }}>
              <div className="status-dot" />
              {item.statusTag.text}
            </div>
          )}
          <div className="fr-card__labels">
            {item.labels.map((label, i) => (
              <span className="fr-card__label" key={i}>{label}</span>
            ))}
          </div>
          <h3 className="fr-card__title">{item.title}</h3>
          <p className="fr-card__desc">{item.description}</p>
        </div>

        <div>
          {item.stats.length > 0 && (
            <div className="fr-card__stats">
              {item.stats.map((stat, i) => (
                <div className="fr-card__stat" key={i}>
                  <div className="fr-card__stat-value">{stat.value}</div>
                  <div className="fr-card__stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          <Link className="fr-card__cta" to={`/research/${item.slug}`}>
            VIEW RESEARCH
            <span className="fr-card__cta-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* Right — Image */}
      <div className="fr-card__image-area">
        <img
          className="fr-card__image"
          src={item.image}
          alt={item.title}
          loading="lazy"
        />
      </div>
    </article>
  );
}

/* ──────────────── Section Component ──────────────── */

export default function FeaturedResearch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = homeFeatured.length;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const vh = window.innerHeight;

      // How far we've scrolled into this section (0 → 1)
      const scrolled = -rect.top;
      const maxScroll = sectionHeight - vh;
      const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

      // Map progress to activeIndex (0 → cardCount)
      setActiveIndex(progress * cardCount);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cardCount]);

  return (
    <section
      className="featured-research"
      id="featured-research"
      ref={sectionRef}
      style={{ height: `${(cardCount * 2 + 1) * 100}vh` }}
    >
      <div className="featured-research__sticky">
        <div className="featured-research__inner">
          {/* Heading — stays pinned at top */}
          <h2 className="featured-research__heading">
            <span className="featured-research__heading-solid">Featured</span>
            <span className="featured-research__heading-outline">Research</span>
          </h2>

          {/* Cards viewport — stacked, scroll-driven */}
          <div className="featured-research__cards-viewport">
            {homeFeatured.map((item, i) => (
              <ResearchCard
                item={item}
                index={i}
                activeIndex={activeIndex}
                cardCount={cardCount}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
