import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import PageTransition from '../../components/PageTransition/PageTransition';
import Footer from '../../components/Footer/Footer';
import BotCursor from '../../components/BotCursor/BotCursor';
import LinkPreview from '../../components/LinkPreview/LinkPreview';
import './AboutPage.css';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* ──────────────── Terminal Text Sequence ──────────────── */
const TERMINAL_LINES = [
  '> INITIALIZING SYS_ENV...',
  '> LOADING MODULE: mohit_marvania.core',
  '> CURRENT_FOCUS: AI Research & Systems Engineering',
  '> STACK: LLMs, PyTorch, Distributed Systems, Algorithms',
  '> STATUS: Exploring the boundaries of robust reasoning.',
  '> ready.'
];

/* ──────────────── Core Foundations Data ──────────────── */
const CORE_FOUNDATIONS = [
  {
    num: '01',
    title: 'Robustness & Provenance',
    desc: 'Engineering stability-aware defense mechanisms and cryptographic watermarks to ensure AI systems survive extreme adversarial attacks and maintain verifiable provenance in the wild.'
  },
  {
    num: '02',
    title: 'Continuous Alignment',
    desc: 'Investigating reinforcement learning paradigms (PPO, DPO, GRPO) to mitigate catastrophic forgetting, ensuring critical safety guardrails persist across sequential model updates.'
  },
  {
    num: '03',
    title: 'Real-World Evaluation',
    desc: 'Moving beyond static academic benchmarks to stress-test multimodal models against chaotic, realistic human noise, establishing zero-trust baselines for high-stakes deployment.'
  },
  {
    num: '04',
    title: 'Multimodal Analysis',
    desc: 'Evaluating Large Vision-Language Models (LVLMs) and processing complex fMRI/MRI datasets to identify structural gaps and mitigate hallucinations in clinical imaging pipelines.'
  }
];

/* ──────────────── Experience Data ──────────────── */
const EXPERIENCE_TIMELINE = [
  {
    id: 'exp1',
    role: 'Graduate Research Assistant',
    company: 'George Mason University',
    date: '2025 — Present',
    desc: 'Spearheading AI safety and medical imaging research by architecting robust evaluation frameworks for frontier models. Accomplished the submission of multiple co-first author papers to top-tier venues (ICML, ARR) by engineering novel cryptographic watermarking techniques (PSS) and stress-testing sequential RLHF alignment pipelines.'
  },
  {
    id: 'exp2',
    role: 'Machine Learning Researcher Intern',
    company: 'Charusat University',
    date: '2023 — 2024',
    desc: 'Accelerated high-throughput model training capabilities by architecting scalable MLOps infrastructure and automating complex data pipelines. Successfully transitioned theoretical models into production-ready deployments by engineering and optimizing computer vision-based engagement systems.'
  },
  {
    id: 'exp3',
    role: 'Software Engineering Intern',
    company: 'Raven Technolabs',
    date: '2023',
    desc: 'Enhanced overall system performance and backend reliability by restructuring core services and optimizing complex database queries to significantly reduce latency. Enforced rigorous software lifecycle standards by implementing automated CI/CD pipelines for seamless testing and deployment.'
  }
];

const EDUCATION_TIMELINE = [
  {
    id: 'edu1',
    role: 'M.S. in Computer Science',
    company: 'George Mason University',
    date: '2024 - 2026',
    desc: (<>Specializing in Machine Learning with a rigorous focus on Natural Language Processing (NLP), Large Language Models (LLMs), Multimodal AI, and systemic AI safety. As a Graduate Research Assistant under <LinkPreview href="https://sites.google.com/site/abolfazlsafikhani/">Dr. Safikhani</LinkPreview>, I drive analytical research in medical imaging (fMRI/MRI) to map predictive cognitive features. Concurrently, in collaboration with <LinkPreview href="https://zziwei.github.io">Dr. Ziwei Zhu</LinkPreview>, I engineer robust evaluation frameworks for frontier models—stress-testing medical AI systems against real-world noise, developing stability-aware cryptographic watermarks, and mitigating catastrophic forgetting in sequential alignment pipelines.</>)
  },
  {
    id: 'edu2',
    role: 'B.Tech in Computer Science',
    company: 'Charotar University of Science & Technology',
    date: '2020 - 2024',
    desc: 'Built a rigorous engineering foundation focused on scalable systems, computer vision architectures, and complex data operations. Transitioned theoretical machine learning concepts into automated, production-ready pipelines, establishing the architectural groundwork for advanced MLOps and AI alignment research.'
  }
];

const BENTO_STACK = [
  {
    category: "Core AI / Architecture",
    skills: ["PyTorch", "JAX", "TensorFlow", "CUDA", "Triton"]
  },
  {
    category: "Systems & Deployment",
    skills: ["Ray", "vLLM", "DeepSpeed", "Docker", "Kubernetes", "AWS"]
  },
  {
    category: "Tooling & Interfaces",
    skills: ["Python", "C++", "React", "TypeScript", "Next.js"]
  }
];

const PHOTOGRAPHY_GALLERY = [
  { id: 'p1', src: '/images/gallery/image1.jpg', caption: 'Mt. Rainier Summit (2023)' },
  { id: 'p2', src: '/images/gallery/image2.jpg', caption: 'Olympic Peninsula, Mamiya RB67' },
  { id: 'p3', src: '/images/gallery/image3.jpg', caption: 'Iceland Black Sand Beach' },
  { id: 'p4', src: '/images/gallery/image4.jpg', caption: 'Banff Reflections, 35mm Portra' },
];

export default function AboutPage() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // ──────────────── Custom Carousel State ────────────────
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % PHOTOGRAPHY_GALLERY.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isCarouselHovered]);

  const getCarouselPosition = (index: number) => {
    const length = PHOTOGRAPHY_GALLERY.length;
    let offset = (index - carouselIndex) % length;

    // Normalize into positive circular offset, then calculate relative shortest distance
    if (offset < -Math.floor(length / 2)) offset += length;
    if (offset > Math.floor(length / 2)) offset -= length;

    if (offset === 0) return "center";
    if (offset === 1) return "right";
    if (offset === -1) return "left";
    return "hidden";
  };

  const carouselVariants = {
    center: { x: "0%", scale: 1, filter: "blur(0px)", opacity: 1, zIndex: 10 },
    right: { x: "70%", scale: 0.75, filter: "blur(6px)", opacity: 0.5, zIndex: 5 },
    left: { x: "-70%", scale: 0.75, filter: "blur(6px)", opacity: 0.5, zIndex: 5 },
    hidden: { x: "0%", scale: 0.5, filter: "blur(10px)", opacity: 0, zIndex: 0 }
  };

  // ──────────────── Custom Bot Sequence State ────────────────
  const gridRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const desc3Ref = useRef<HTMLParagraphElement>(null);

  const isGridInView = useInView(gridRef, { once: true, margin: "-100px" });
  const hasSequencePlayed = useRef(false);

  // Bot states
  const [botVisible, setBotVisible] = useState(false);
  const [botTarget, setBotTarget] = useState({ x: -100, y: -100 });
  const [botInitPos, setBotInitPos] = useState<{ x: number; y: number } | null>(null);
  const [botMessage, setBotMessage] = useState('');
  const [showBotMessage, setShowBotMessage] = useState(false);

  const [fontOverride, setFontOverride] = useState(false);
  const [colorOverride, setColorOverride] = useState(false);

  // Dynamic Title 1 Text for backspace effect
  const [title1Text, setTitle1Text] = useState("Robustness & Provenance");

  // Tracks which element the bot is currently flying to/hovering over
  const [trackingIndex, setTrackingIndex] = useState<number | null>(null);

  // ──────────────── Typewriter Helpers ────────────────
  const typeText = async (setText: (t: string) => void, text: string, speed = 80) => {
    let current = '';
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      setText(current);
      await sleep(speed);
    }
  };

  const backspaceText = async (setText: (t: string) => void, text: string, speed = 60) => {
    let current = text;
    for (let i = current.length; i >= 0; i--) {
      setText(current.slice(0, i));
      await sleep(speed);
    }
  };

  // ──────────────── Sequence Control ────────────────
  useEffect(() => {
    if (isGridInView && !hasSequencePlayed.current) {
      hasSequencePlayed.current = true;

      const runSequence = async () => {
        // ── EVENT 1: Font Change & Typing ──
        await sleep(3000);

        setBotInitPos({ x: window.innerWidth + 200, y: window.scrollY + window.innerHeight / 2 });
        setBotVisible(true);

        await sleep(50);
        setTrackingIndex(0);

        await sleep(1500);
        // Step 1: Backspace original text
        await backspaceText(setTitle1Text, "Robustness & Provenance", 30);

        // Step 2: Swap font and type new text
        setFontOverride(true);
        await typeText(setTitle1Text, "Robustness & Provenance", 40);

        await sleep(800);
        setBotMessage("Hmm... maybe a little looser?");
        setShowBotMessage(true);

        await sleep(3000);
        setShowBotMessage(false);

        // Step 3: Backspace comic text
        await backspaceText(setTitle1Text, "Robustness & Provenance", 30);

        // Step 4: Swap font back and type original
        setFontOverride(false);
        await typeText(setTitle1Text, "Robustness & Provenance", 40);

        await sleep(600);
        setBotMessage("No. Original is better.");
        setShowBotMessage(true);

        await sleep(1800);
        setShowBotMessage(false);
        setTrackingIndex(null);
        setBotTarget({ x: window.innerWidth + 200, y: window.scrollY });

        await sleep(1000);
        setBotVisible(false);

        // ── EVENT 2: Color Shift ──
        await sleep(5000);

        setBotInitPos({ x: window.innerWidth + 200, y: window.scrollY + window.innerHeight });
        setBotVisible(true);

        await sleep(50);
        setTrackingIndex(2);

        await sleep(1500);
        setColorOverride(true);

        await sleep(800);
        setBotMessage("Needs more contrast!");
        setShowBotMessage(true);

        await sleep(3000);
        setShowBotMessage(false);
        setColorOverride(false);

        await sleep(600);
        setBotMessage("Okay, too loud. Keep it clean.");
        setShowBotMessage(true);

        await sleep(1800);
        setShowBotMessage(false);
        setTrackingIndex(null);
        setBotTarget({ x: window.innerWidth + 200, y: window.scrollY + window.innerHeight + 200 });

        await sleep(1000);
        setBotVisible(false);
        setBotInitPos(null);
      };

      runSequence();
    }
  }, [isGridInView]);

  // ──────────────── Dynamic Coordinate Tracking ────────────────
  useEffect(() => {
    if (!botVisible || trackingIndex === null) return;

    let rafId: number;
    const trackTarget = () => {
      let rect: DOMRect | null = null;
      let offsetX = 0;
      let offsetY = 0;

      if (trackingIndex === 0 && title1Ref.current) {
        rect = title1Ref.current.getBoundingClientRect();
        offsetX = rect.width / 2;
        offsetY = 15;
      } else if (trackingIndex === 2 && desc3Ref.current) {
        rect = desc3Ref.current.getBoundingClientRect();
        offsetX = rect.width / 2;
        offsetY = rect.height / 2;
      }

      if (rect) {
        // Because BotCursor is position:fixed inside a framer-motion transform parent,
        // it acts as position:absolute to the page document. We must add window.scrollY!
        setBotTarget({ x: rect.left + offsetX, y: rect.top + window.scrollY + offsetY });
      }
      rafId = requestAnimationFrame(trackTarget);
    };

    rafId = requestAnimationFrame(trackTarget);
    return () => cancelAnimationFrame(rafId);
  }, [botVisible, trackingIndex]);

  // ──────────────── Typewriter Effect ────────────────
  useEffect(() => {
    if (currentLineIndex >= TERMINAL_LINES.length) return;

    const fullLine = TERMINAL_LINES[currentLineIndex];

    if (currentCharIndex < fullLine.length) {
      const timeout = setTimeout(() => {
        setTypedLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = '';
          }
          newLines[currentLineIndex] = fullLine.substring(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, Math.random() * 30 + 20); // random typing speed ~20-50ms

      return () => clearTimeout(timeout);
    } else {
      // Pause at the end of a line before starting the next one
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 400); // 400ms pause between lines
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  return (
    <PageTransition>
      <div className="about-page">
        {/* ─── HERO SECTION ─── */}
        <section className="about-hero">
          <div className="about-hero__left">
            <h1 className="about-hero__title">
              ABOUT<span className="about-hero__title-dot">.</span>
            </h1>

            <div className="about-hero__content">
              <p className="about-hero__lead">
                {/* I engineer AI systems that don't just conquer clean benchmarks, they remain robust, interpretable, and safe under chaotic, real-world constraints. */}
                Engineering AI systems that don't just scale, they survive reality.
              </p>
              <p className="about-hero__text">
                My research targets the fundamental vulnerabilities of frontier models, bridging the gap between theoretical capability and real-world reliability. I investigate how large language models fail when pushed beyond clean, static benchmarks and build the infrastructure to secure them. My primary work spans the critical pillars of AI safety: developing resilient, stability-aware cryptographic watermarks that can track synthetic text even under extreme adversarial attacks, and engineering VeriSim, a pioneering evaluation framework that stress-tests medical models against the chaotic, realistic noise of actual patient communication.
              </p>
              <p className="about-hero__text">
                {/* Beyond standalone evaluations, I am deeply focused on the continuous alignment and multimodal safety of next-generation architectures. I am currently evaluating the catastrophic forgetting of safety guardrails during sequential RLHF training, specifically engineering GRPO baselines to measure how continuous updates degrade prior policies. Concurrently, I collaborate on stress-testing Large Vision-Language Models (LVLMs) to mitigate multimodal hallucinations and analyze fMRI/MRI data to discover novel gaps in medical imaging. Ultimately, my goal is to ensure that as AI systems grow more capable, they remain honest, interpretable, and structurally secure in production. */}
                Beyond evaluation, I focus on the continuous alignment and multimodal safety of next-generation architectures. I am currently analyzing catastrophic forgetting in sequential RLHF training, specifically engineering GRPO baselines to measure how continuous policy updates degrade prior safety guardrails. Concurrently, I collaborate on mitigating hallucinations in Large Vision-Language Models (LVLMs) and analyzing fMRI/MRI datasets to identify predictive gaps in medical imaging. Ultimately, my goal is to ensure scaling AI systems remain honest, interpretable, and structurally secure.
              </p>
            </div>
          </div>

          <div className="about-hero__right">
            {/* Console / Data Block */}
            <div className="about-terminal">
              <div className="about-terminal__header">
                <div className="about-terminal__dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="about-terminal__title">sys_profile.sh</div>
              </div>
              <div className="about-terminal__body">
                {typedLines.map((line, idx) => (
                  <div key={idx} className="about-terminal__line">
                    <span className="about-terminal__prompt">mohit@workspace:~$</span> {line}
                  </div>
                ))}
                {/* Blinking Cursor */}
                {currentLineIndex < TERMINAL_LINES.length && (
                  <div className="about-terminal__line">
                    <span className="about-terminal__prompt">mohit@workspace:~$</span>
                    <span className="about-terminal__cursor">_</span>
                  </div>
                )}
                {currentLineIndex >= TERMINAL_LINES.length && (
                  <div className="about-terminal__line">
                    <span className="about-terminal__cursor blink">_</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CORE FOUNDATIONS SECTION ─── */}
        <section className="about-foundations" ref={gridRef}>
          <div className="about-foundations__header">
            <h2>
              <span className="solid">CORE</span> <span className="outline">FOUNDATIONS</span>
            </h2>
          </div>

          <div className="about-foundations__grid">
            {CORE_FOUNDATIONS.map((item, index) => (
              <motion.div
                key={item.num}
                className="foundation-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="foundation-card__num">{item.num}</div>
                <h3
                  className={`foundation-card__title ${fontOverride && index === 0 ? 'easter-egg-font' : ''}`}
                  ref={index === 0 ? title1Ref : null}
                >
                  {index === 0 ? title1Text : item.title}
                </h3>
                <p
                  className={`foundation-card__desc ${colorOverride && index === 2 ? 'easter-egg-color' : ''}`}
                  ref={index === 2 ? desc3Ref : null}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── EXPERIENCE SECTION ─── */}
        <section className="about-experience">
          <div className="about-experience__inner">

            {/* Sticky Left Header */}
            <div className="about-experience__left">
              <h2 className="about-experience__title">
                EXPERIENCE
              </h2>
            </div>

            {/* Scrolling Right List */}
            <div className="about-experience__right">
              {EXPERIENCE_TIMELINE.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="experience-item"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="experience-item__header">
                    <span className="experience-item__date">{exp.date}</span>
                    <h3 className="experience-item__role">{exp.role}</h3>
                  </div>
                  <div className="experience-item__company">{exp.company}</div>
                  <p className="experience-item__desc">{exp.desc}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── EDUCATION SECTION ─── */}
        <section className="about-experience about-experience--flipped">
          <div className="about-experience__inner">

            {/* Sticky Left Header */}
            <div className="about-experience__left">
              <h2 className="about-experience__title">
                EDUCATION
              </h2>
            </div>

            {/* Scrolling Right List */}
            <div className="about-experience__right">
              {EDUCATION_TIMELINE.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  className="experience-item"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="experience-item__header">
                    <span className="experience-item__date">{edu.date}</span>
                    <h3 className="experience-item__role">{edu.role}</h3>
                  </div>
                  <div className="experience-item__company">{edu.company}</div>
                  <p className="experience-item__desc" style={{ textAlign: "justify" }}>{edu.desc}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ─── TECH STACK BENTO GRID ─── */}
        <section className="about-tech">
          <div className="about-tech__inner">
            <div className="about-tech__header">
              <h2>THE TOOLKIT</h2>
            </div>

            <div className="bento-grid">
              {BENTO_STACK.map((block, index) => (
                <motion.div
                  key={index}
                  className="bento-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="bento-card__title">{block.category}</h3>
                  <div className="bento-card__skills">
                    {block.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="bento-skill">
                        <span className="bento-skill__bullet">✦</span> {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── THE OFF-SCREEN (INFINITE CAROUSEL) ─── */}
        <section className="about-offscreen">
          <div className="offscreen-header-block">
            <h2 className="offscreen-header">BEYOND THE CODE</h2>
            <p className="offscreen-desc">
              When I'm not tracing attention mechanisms or battling CUDA errors, you can usually find me hiking mountains and clicking amazing memories through my lens.
            </p>
          </div>

          <div
            className="carousel-wrapper"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            <div className="carousel-track">
              {PHOTOGRAPHY_GALLERY.map((photo, index) => {
                const position = getCarouselPosition(index);

                return (
                  <motion.div
                    key={photo.id}
                    className="carousel-slide"
                    initial={false}
                    animate={position}
                    variants={carouselVariants}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 30
                    }}
                    onClick={() => {
                      if (position === "right") setCarouselIndex((prev) => (prev + 1) % PHOTOGRAPHY_GALLERY.length);
                      if (position === "left") setCarouselIndex((prev) => (prev - 1 + PHOTOGRAPHY_GALLERY.length) % PHOTOGRAPHY_GALLERY.length);
                    }}
                  >
                    <div className="carousel-image-container">
                      <img src={photo.src} alt={photo.caption} className="carousel-photo" />
                    </div>

                    <div className={`carousel-caption ${position === 'center' ? 'is-visible' : ''}`}>
                      <span className="carousel-caption-text">{photo.caption}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Nav Arrows */}
            <button
              className="carousel-nav btn-left"
              onClick={() => setCarouselIndex((prev) => (prev - 1 + PHOTOGRAPHY_GALLERY.length) % PHOTOGRAPHY_GALLERY.length)}
            >
              ←
            </button>
            <button
              className="carousel-nav btn-right"
              onClick={() => setCarouselIndex((prev) => (prev + 1) % PHOTOGRAPHY_GALLERY.length)}
            >
              →
            </button>
          </div>
        </section>

      </div>

      <BotCursor
        targetX={botTarget.x}
        targetY={botTarget.y}
        visible={botVisible}
        message={botMessage}
        showMessage={showBotMessage}
        initialPosition={botInitPos}
      />

      <Footer />
    </PageTransition>
  );
}
