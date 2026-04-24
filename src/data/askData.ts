/* ============================================
   ASK MY WORK — PRE-BUILT Q&A DATA
   ============================================
   
   Update questions and answers here.
   The command palette fuzzy-matches user input
   against each `question` string. Clicking a
   result or pressing Enter shows the `answer`
   with a typewriter effect.

   CATEGORIES:
   - research   → Research-related questions
   - skills     → Tech stack & tools
   - career     → Experience & education
   - personal   → Personality & interests
   - meta       → About the portfolio itself
   ============================================ */

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  category: 'research' | 'skills' | 'career' | 'personal' | 'meta';
  emoji: string;
}

export interface TopicCard {
  emoji: string;
  title: string;
  /** The question ID to trigger when clicked */
  triggerQuestionId: string;
  color: string; // CSS background color
}

export interface QuickChip {
  emoji: string;
  label: string;
  triggerQuestionId: string;
}

/* ──────────────── TOPIC CARDS ──────────────── */

export const TOPIC_CARDS: TopicCard[] = [
  {
    emoji: '🔬',
    title: 'Research\noverview',
    triggerQuestionId: 'research-overview',
    color: 'rgba(99, 102, 241, 0.15)',
  },
  {
    emoji: '🛠',
    title: 'Tech stack\n& skills',
    triggerQuestionId: 'tech-stack',
    color: 'rgba(226, 255, 0, 0.1)',
  },
  {
    emoji: '💼',
    title: 'Career\nhighlights',
    triggerQuestionId: 'career-highlights',
    color: 'rgba(234, 179, 8, 0.12)',
  },
  {
    emoji: '✦',
    title: 'What makes\nhim different',
    triggerQuestionId: 'what-different',
    color: 'rgba(31, 214, 85, 0.1)',
  },
];

/* ──────────────── QUICK CHIPS ──────────────── */

export const QUICK_CHIPS: QuickChip[] = [
  { emoji: '📄', label: 'current research', triggerQuestionId: 'current-research' },
  { emoji: '🎓', label: 'education', triggerQuestionId: 'education' },
  { emoji: '📬', label: 'contact info', triggerQuestionId: 'contact' },
  { emoji: '🧠', label: 'core philosophy', triggerQuestionId: 'philosophy' },
];

/* ──────────────── Q&A DATABASE ──────────────── */

export const QA_DATABASE: QAItem[] = [
  // ─── RESEARCH ───
  {
    id: 'research-overview',
    question: 'What is your research about?',
    answer: `My research targets the fundamental vulnerabilities of frontier AI models. I work across three pillars:\n\n1. **Pattern Stability Score (PSS)** — A watermark detection framework that identifies LLM-generated text even after 8 rounds of adversarial paraphrasing, achieving 91.2% AUC where other methods collapse to ~40%.\n\n2. **Catastrophic Forgetting in Alignment** — Investigating how sequential RLHF training (PPO, DPO, GRPO) causes models to forget safety guardrails when learning new objectives.\n\n3. **VeriSim** — A medical AI evaluation framework that stress-tests diagnostic models against realistic patient noise, revealing severe fragility in systems that ace clean benchmarks.\n\nThe common thread: I build systems that survive reality, not just benchmarks.`,
    category: 'research',
    emoji: '🔬',
  },
  {
    id: 'current-research',
    question: 'What are you currently working on?',
    answer: `Right now I'm actively working on three projects at George Mason University:\n\n• **PSS (Pattern Stability Score)** — Under review at ICML 2026. We've proven that local rolling-window statistics can recover watermark signals that global detectors and neural classifiers completely miss after adversarial rewriting.\n\n• **Catastrophic Forgetting** — I'm engineering GRPO baselines to measure how continuous alignment updates degrade prior safety policies across Llama-3.1-8B and Qwen3-4B.\n\n• **VeriSim** — Under review at ARR March 2026. This framework injects clinically realistic noise (symptom exaggeration, omission, emotional distractors) into clean medical benchmarks to expose model fragility.\n\nI also collaborate on mitigating hallucinations in Large Vision-Language Models and analyzing fMRI/MRI datasets for medical imaging research.`,
    category: 'research',
    emoji: '🔬',
  },
  {
    id: 'pss-details',
    question: 'How does the Pattern Stability Score work?',
    answer: `PSS is a detector-centric framework for watermark detection. Instead of modifying how LLMs generate text, it analyzes text retroactively:\n\n1. **Local Feature Extraction** — Instead of computing a single global z-score (which attackers easily disrupt), we slide a window across the text's binary indicator sequence and compute higher-order statistics of run-length patterns and short-range autocorrelations.\n\n2. **Cross-Depth Stability** — We measure how these local statistics behave across up to 8 rounds of paraphrasing. If text is genuinely watermarked, the statistical bias persists even through aggressive rewrites.\n\n3. **Universal Classification** — A single classifier demonstrates zero-shot generalization across different domains and attacker configurations without retraining.\n\nThe results: 91.2% AUC at 8x paraphrase depth, compared to ~40% for state-of-the-art neural methods. Currently under review at ICML 2026.`,
    category: 'research',
    emoji: '🔬',
  },
  {
    id: 'verisim-details',
    question: 'What is VeriSim?',
    answer: `VeriSim is a configurable evaluation framework that exposes the gap between clean-benchmark performance and real-world clinical readiness in medical AI.\n\nThe problem: Medical LLMs score expert-level accuracy on sanitized datasets like MedQA. But real patients don't speak in structured medical ontology — they omit details, exaggerate symptoms, and introduce emotional noise.\n\nOur solution: VeriSim algorithmically injects 5 dimensions of clinically realistic noise into standard benchmarks — symptom exaggeration, critical omission, colloquial phrasing, emotional distractors, and conversational tangents.\n\nThe result: State-of-the-art models that perform flawlessly on clean data showed severe diagnostic degradation under realistic conditions. This framework establishes a new zero-trust baseline for medical AI deployment.\n\nCurrently under review at ARR March 2026.`,
    category: 'research',
    emoji: '🏥',
  },
  {
    id: 'forgetting-details',
    question: 'Tell me about the catastrophic forgetting research.',
    answer: `This project investigates what happens when frontier models are continuously updated — each new alignment objective (safety → helpfulness → coding) risks overwriting previously learned behaviors.\n\nWe're building a dynamic evaluation framework to measure Backward Transfer (BWT) across 5 alignment domains: safety, helpfulness, honesty, instruction following, and code generation.\n\nMy primary role: I architect the GRPO (Group Relative Policy Optimization) baselines, training Llama-3.1-8B and Qwen3-4B across various sequential ablations — 3-task orderings, plus full 5-domain "conflict," "cooperative," and "random" permutations.\n\nEarly insights reveal that the choice of RL algorithm (PPO vs DPO vs GRPO) fundamentally alters the geometry of the forgetting curve. This work is still in progress.`,
    category: 'research',
    emoji: '🧠',
  },

  // ─── SKILLS ───
  {
    id: 'tech-stack',
    question: 'What is your tech stack?',
    answer: `Here's my technical toolkit:\n\n**Core AI / Architecture:**\nPyTorch · JAX · TensorFlow · CUDA · Triton\n\n**Systems & Deployment:**\nRay · vLLM · DeepSpeed · Docker · Kubernetes · AWS\n\n**Tooling & Interfaces:**\nPython · C++ · React · TypeScript · Next.js\n\nI'm most comfortable in PyTorch and Python — that's where most of my research engineering happens. For distributed training and inference, I work heavily with DeepSpeed and vLLM. I also build full-stack tools when needed (like this portfolio, built in React + TypeScript).`,
    category: 'skills',
    emoji: '🛠',
  },
  {
    id: 'frameworks',
    question: 'What ML frameworks do you use?',
    answer: `My primary framework is **PyTorch** — it's where I do all my research work, from training alignment baselines to building custom evaluation pipelines.\n\nFor high-performance computing, I use **JAX** for its XLA compilation, **CUDA** and **Triton** for writing custom GPU kernels, and **DeepSpeed** for distributed training across multi-GPU setups.\n\nFor inference at scale, I work with **vLLM** — critical for efficient LLM serving when evaluating models across thousands of test cases.\n\n**Ray** handles distributed workload orchestration, and everything ships in **Docker/Kubernetes** containers on **AWS**.`,
    category: 'skills',
    emoji: '⚡',
  },

  // ─── CAREER ───
  {
    id: 'career-highlights',
    question: 'What are your career highlights?',
    answer: `Here's my journey so far:\n\n**Graduate Research Assistant @ George Mason University** (2025–Present)\nSpearheading AI safety and medical imaging research. Submitted multiple co-first author papers to ICML and ARR. Engineered novel cryptographic watermarking (PSS) and stress-tested sequential RLHF alignment pipelines.\n\n**ML Researcher Intern @ Charusat University** (2023–2024)\nArchitected scalable MLOps infrastructure, automated data pipelines, and transitioned theoretical CV models into production-ready deployments.\n\n**Software Engineering Intern @ Raven Technolabs** (2023)\nOptimized backend systems, reduced database latency, and implemented automated CI/CD pipelines.\n\nI'm currently pursuing my M.S. in Computer Science at George Mason, specializing in Machine Learning with a focus on NLP, LLMs, and AI Safety.`,
    category: 'career',
    emoji: '💼',
  },
  {
    id: 'education',
    question: 'Where did you study?',
    answer: `**M.S. Computer Science — George Mason University** (2024–2026)\nSpecializing in Machine Learning with a focus on NLP, LLMs, Multimodal AI, and AI Safety. Working as a Graduate Research Assistant under Dr. Safikhani (medical imaging: fMRI/MRI) and Dr. Ziwei Zhu (evaluation frameworks, watermarking, alignment).\n\n**B.Tech Computer Science — Charotar University of Science & Technology** (2020–2024)\nBuilt a strong engineering foundation in scalable systems, computer vision, and data operations. Transitioned ML concepts into automated, production-ready pipelines.`,
    category: 'career',
    emoji: '🎓',
  },
  {
    id: 'looking-for',
    question: 'Are you looking for opportunities?',
    answer: `Yes! I'm actively seeking **Research Engineer**, **ML Engineer**, and **Applied Scientist** roles where I can work on the safety, robustness, and evaluation of frontier AI systems.\n\nI'm particularly interested in teams working on:\n• LLM safety & alignment\n• Adversarial robustness & red-teaming\n• Evaluation infrastructure for AI systems\n• Medical AI & clinical deployment\n\nI bring hands-on research experience (ICML, ARR submissions), strong systems engineering skills (PyTorch, DeepSpeed, vLLM), and a track record of translating theoretical work into rigorous, production-quality code.\n\nFeel free to reach out — I'd love to chat!`,
    category: 'career',
    emoji: '🚀',
  },

  // ─── PERSONAL ───
  {
    id: 'what-different',
    question: 'What makes you different from other researchers?',
    answer: `Most ML researchers optimize for benchmark performance. I optimize for **reality**.\n\nHere's what I mean: I don't consider a model "working" just because it scores well on a clean test set. My work specifically targets what breaks when you push systems into the real world:\n\n• Watermarks that survive 8 rounds of adversarial attacks (not just 1)\n• Medical AI that handles messy, human patient communication (not sanitized vignettes)\n• Alignment that persists across continuous model updates (not a single training step)\n\nI also bridge the gap between research and engineering — I don't just write papers, I build robust, deployable systems. Every framework I create (PSS, VeriSim) is designed to be practical infrastructure, not just an academic proof-of-concept.`,
    category: 'personal',
    emoji: '✦',
  },
  {
    id: 'philosophy',
    question: 'What is your core research philosophy?',
    answer: `Four pillars drive everything I build:\n\n**01 — Robustness & Provenance**\nEngineering defense mechanisms and cryptographic watermarks that survive extreme adversarial attacks.\n\n**02 — Continuous Alignment**\nInvestigating how PPO, DPO, and GRPO handle catastrophic forgetting to keep safety guardrails intact.\n\n**03 — Real-World Evaluation**\nStress-testing models against chaotic, realistic noise instead of clean benchmarks.\n\n**04 — Multimodal Analysis**\nEvaluating LVLMs and processing complex medical imaging data to bridge structural gaps.\n\nThe unifying question across all my work: *"Does it still work when nothing goes as planned?"*`,
    category: 'personal',
    emoji: '🧠',
  },
  {
    id: 'interests',
    question: 'What are your interests outside of research?',
    answer: `Beyond the lab, I'm deeply fascinated by **space and astrophysics** — I love exploring the cosmos through photography and just spending time thinking about what's out there.\n\nI'm also passionate about **photography** in general, especially landscape and nature photography. I enjoy capturing moments in places like Mt. Rainier, Iceland's black sand beaches, and Banff.\n\nAnd of course, I'm always building things — whether it's a research framework, a full-stack web app, or just tinkering with new tools and technologies. I still get excited about an elegant solution the same way I did when I wrote my first line of code.`,
    category: 'personal',
    emoji: '🌌',
  },

  // ─── META ───
  {
    id: 'contact',
    question: 'How can I contact you?',
    answer: `The best way to reach me is via email — I'm always happy to discuss research, opportunities, or just chat about AI.\n\n**📧 Email:** [mohitmarvania@gmail.com](mailto:mohitmarvania@gmail.com)\n\n**🔗 GitHub:** [github.com/mohitmarvania](https://github.com/mohitmarvania)\n**🔗 LinkedIn:** [linkedin.com/in/mohit-marvania](https://linkedin.com/in/mohit-marvania)\n\nI typically respond within 24 hours. Looking forward to hearing from you!`,
    category: 'meta',
    emoji: '📬',
  },
  {
    id: 'portfolio-tech',
    question: 'How was this portfolio built?',
    answer: `This portfolio is built with **React + TypeScript + Vite**, using:\n\n• **Framer Motion** for the scroll-driven animations and page transitions\n• **React Router** for client-side navigation\n• **Vanilla CSS** with custom design tokens for the full design system\n• A custom **bot cursor** animation on the About page\n• A **loading screen** with typewriter effects\n\nNo paid services, no CMS, no AI APIs — everything runs statically in the browser. The research data is managed through a single TypeScript file, making it trivial to add new papers.\n\nDesign-wise, it's heavily inspired by modern editorial portfolios — think minimal, typographic-first, with intentional negative space and cinematic transitions.`,
    category: 'meta',
    emoji: '💻',
  },
  {
    id: 'publications',
    question: 'Do you have any publications?',
    answer: `I currently have two papers under review at top-tier venues:\n\n**1. Pattern Stability Score (PSS)** — Under Review at ICML 2026\nA novel watermark detection framework achieving 91.2% AUC at 8x adversarial paraphrase depth. Co-first author.\n\n**2. VeriSim** — Under Review at ARR March 2026\nA configurable evaluation framework that stress-tests medical AI systems under 5 dimensions of realistic patient noise. Co-first author.\n\n**3. Catastrophic Forgetting in Sequential Alignment** — In Progress\nSystematic evaluation of how PPO, DPO, and GRPO handle sequential post-training, with focus on backward transfer metrics.\n\nI also have ongoing work on multimodal hallucination mitigation in LVLMs and fMRI/MRI analysis for medical imaging.`,
    category: 'research',
    emoji: '📄',
  },
];
