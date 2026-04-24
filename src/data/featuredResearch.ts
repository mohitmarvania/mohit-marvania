/* ============================================
   FEATURED RESEARCH DATA
   ============================================
   Add, remove, or reorder entries here.

   ▸ HOME PAGE: Only items with `featured: true`
     appear in the scroll-driven cards (max 3).
   ▸ /RESEARCH PAGE: ALL items in this array are
     shown in the grid.
   ▸ /RESEARCH/:SLUG: Each item's detail page is
     auto-generated from its contentSections.
   ============================================ */

export interface ResearchStat {
  value: string;   // e.g. "97.3%"
  label: string;   // e.g. "DETECTION ACCURACY"
}

export interface ResearchMeta {
  label: string;
  value: string;
}

export interface ContentSection {
  id: string;      // URL hash or anchor target
  title: string;   // e.g. "01 / Architecture"
  paragraphs: string[];
  image?: string;  // Optional plot or figure image for this section
}

export interface FeaturedResearchItem {
  /** Unique URL slug */
  slug: string;
  /** If true, this item appears in the Home Page scroll cards (top 3 max) */
  featured?: boolean;
  /** Category labels shown above the title */
  labels: string[];
  /** Main title */
  title: string;
  /** Short description paragraph for the grid */
  description: string;
  /** Key metrics / stats displayed at the bottom of the text area */
  stats: ResearchStat[];
  /** Path to the thumbnail image (relative to public/) */
  image: string;

  // ── DETAIL PAGE SPECIFIC FIELDS ──
  /** Massive cinematic cover header image */
  coverImage?: string;
  /** Structured grid data for the top of the detail page */
  metaData?: ResearchMeta[];
  /** Optional glowing status tag above the title */
  statusTag?: {
    text: string;
    color: 'green' | 'yellow' | 'gray' | 'accent'; // You can change this to toggle colors
  };
  /** Large introductory text for the detail view (Abstract) */
  overview?: string;
  /** Array of sticky-scrolling sections */
  contentSections?: ContentSection[];
}

const featuredResearch: FeaturedResearchItem[] = [
  {
    slug: 'pattern-stability-score',
    featured: true, // ← Shown on Home Page
    labels: ['LLM SAFETY', 'WATERMARKING'],
    title: 'Pattern Stability Score',
    description:
      'Developed a novel detection framework that identifies LLM watermarks even after extreme adversarial paraphrasing. By tracking the stability of local statistical features, PSS recovers hidden provenance signals that standard global detectors and neural methods lose.',
    stats: [
      { value: '91.2%', label: 'AUC @ 8x PARAPHRASE' },
      { value: '2.0×', label: 'TPR IMPROVEMENT' },
    ],
    image: '/images/research/pss_card.png',

    // ── DETAIL EXTRAS ──
    coverImage: '/images/research/cover_pss.png',
    metaData: [
      { label: 'DOMAIN', value: 'AI Safety & Provenance' },
      { label: 'INSTITUTION', value: 'George Mason University' },
      { label: 'YEAR', value: '2025' },
      { label: 'CONFERENCE', value: 'ICML 2026' }
    ],
    statusTag: {
      text: 'Under Review · ICML 2026',
      color: 'yellow' // Try 'yellow', 'gray', or 'accent'
    },
    overview: 'As LLMs increasingly integrate into digital workflows, identifying machine-generated content has become a critical requirement. However, existing watermark detectors exhibit sharp performance deterioration under adversarial paraphrasing and on shorter texts. The Pattern Stability Score (PSS) is a detector-centric framework that solves this by leveraging local statistical features and evaluating their stability dynamics across multiple rewrite variants.',
    contentSections: [
      {
        id: 'abstract',
        title: '01 / ABSTRACT & MOTIVATION',
        paragraphs: [
          'What was the core problem? Standard global z-score detectors and complex deep learning classifiers fail catastrophically when an adversary paraphrases watermarked text. They compress all evidence into a single statistic, which attackers can easily disrupt by rearranging local token structures.',
          'The goal was to build a defense-in-depth system that extracts maximum information from existing watermarking schemes. Instead of modifying the generation pipeline—which increases latency and computational cost—we needed a retroactive detector that could survive aggressive adversarial attacks.'
        ]
      },
      {
        id: 'methodology',
        title: '02 / METHODOLOGY & ARCHITECTURE',
        paragraphs: [
          'How did we build it? We engineered a smarter detector that fuses two main ingredients: local rolling-window statistics that preserve the spatial structure of watermark evidence, and a cross-depth stability functional.',
          'By sliding a window across the binary indicator sequence of the text, we compute higher-order statistics of run-length patterns and short-range autocorrelations. We then measure how these local z-scores behave across up to eight depths of paraphrasing. If the text is genuinely watermarked, the underlying statistical bias persists across rewrites, yielding a low Pattern Stability Score (PSS) compared to human text.'
        ],
        // You can uncomment this and put an image path here to show a diagram!
        image: '/images/research/watermarking_pipeline.png'
      },
      {
        id: 'results',
        title: '03 / RESULTS & EVALUATION',
        paragraphs: [
          'What were the outcomes? We subjected the framework to brutal stress tests across three benchmark datasets (PG-19, CNN/DailyMail, WikiText) using multiple LLMs and paraphrasers (Mistral, Qwen, Gemma).',
          'The results were definitive: At 8 rounds of aggressive paraphrasing, state-of-the-art neural methods collapsed to ~40% AUC. PSS maintained a 91.2% AUC. Furthermore, a single universal classifier demonstrated zero-shot generalization across entirely different domains and attacker configurations without retraining, establishing a new standard for robust watermark detection.'
        ],
        image: '/images/research/watermarking_results.png'
      }
    ]
  },
  {
    slug: 'catastrophic-forgetting-alignment',
    featured: true, // ← Shown on Home Page
    labels: ['ALIGNMENT', 'RLHF / GRPO'],
    title: 'Catastrophic Forgetting',
    description:
      'Investigating how sequential post-training objectives (PPO, DPO, GRPO) cause catastrophic forgetting of prior alignments like safety and coding, evaluating which algorithms best preserve Backward Transfer (BWT).',
    stats: [
      { value: '3', label: 'RL ALGORITHMS BENCHMARKED' },
      { value: '5', label: 'ALIGNMENT DOMAINS' },
    ],
    image: '/images/research/forgetting_card.png',

    // ── DETAIL EXTRAS ──
    coverImage: '/images/research/cover_forgetting.png',
    metaData: [
      { label: 'DOMAIN', value: 'Post-Training & Safety' },
      { label: 'MODELS', value: 'Llama-3.1-8B, Qwen3-4B' },
      { label: 'ROLE', value: 'GRPO Baseline Lead' },
      { label: 'YEAR', value: '2026' }
    ],
    statusTag: {
      text: 'Active Research',
      color: 'gray'
    },
    overview: 'As frontier models are continuously updated to be safer, more helpful, or better at coding, they risk unlearning previously established behaviors. This research systematically evaluates catastrophic forgetting across sequential alignment training, providing a rigorous comparison of how PPO, DPO, and GRPO degrade or preserve prior guardrails when exposed to new objectives.',
    contentSections: [
      {
        id: 'abstract',
        title: '01 / THE SEQUENTIAL ALIGNMENT PROBLEM',
        paragraphs: [
          'What happens when a model aligned for helpfulness is subsequently fine-tuned for strict code generation? Does it forget how to be safe? As alignment shifts from a single post-training step to a continuous, lifelong pipeline, understanding how sequential weight updates overwrite existing policy constraints is critical.',
          'Standard benchmarks evaluate alignment at a static point in time. This research introduces a dynamic evaluation framework to measure Backward Transfer (BWT) across complex sequential orderings. By tracking how earlier alignments degrade as new objectives are introduced, we can determine which Reinforcement Learning methodologies are most susceptible to catastrophic forgetting.'
        ]
      },
      {
        id: 'methodology',
        title: '02 / METHODOLOGY & GRPO BASELINE',
        paragraphs: [
          'The evaluation spans five core domains: safety, helpfulness, honesty, instruction following, and code generation. To establish a rigorous ground truth, we train isolated baselines—fine-tuning the base model on each domain independently—before subjecting the models to continual sequential training.',
          'My primary ownership within this collaborative research is engineering the GRPO (Group Relative Policy Optimization) baselines. I architected the training pipelines to subject Llama-3.1-8B-Instruct and Qwen3-4B-Instruct to various sequential ablations. This allows us to directly contrast GRPO’s stability and memory retention against parallel PPO and DPO implementations.'
        ]
      },
      {
        id: 'ablations',
        title: '03 / ABLATION STRATEGY & REWARD MODELING',
        paragraphs: [
          'To isolate the triggers of forgetting, we designed specific task orderings: 3-task ablations with varying domain sequences, alongside full 5-domain "conflict," "cooperative," and "random" permutations.',
          'Crucially, robust evaluation requires robust reward models (RMs). Recognizing the limitations of response-only evaluation, we engineered new prompt-and-response RMs. This shift ensures our Backward Transfer metrics capture true policy degradation rather than artifacts of the evaluation model itself.'
        ]
      },
      {
        id: 'current-status',
        title: '04 / PRELIMINARY INSIGHTS',
        paragraphs: [
          'Early analysis of the continual sequences across the Qwen and Llama architectures indicates complex trade-offs between optimization efficiency and behavioral retention. The variance in BWT across PPO, DPO, and GRPO reveals that the choice of RL algorithm fundamentally alters the geometry of the catastrophic forgetting curve.',
          'These insights provide a quantitative foundation for designing future post-training pipelines that can seamlessly integrate new capabilities without eroding critical safety guardrails.'
        ]
      }
    ]
  },
  {
    slug: 'verisim-medical-eval',
    featured: true, // ← Shown on Home Page
    labels: ['MEDICAL AI', 'EVALUATION', 'ROBUSTNESS'],
    title: 'VeriSim',
    description:
      'A configurable framework designed to evaluate medical AI systems under realistic patient noise, exposing the critical fragility of frontier models when transitioning from clean benchmarks to messy, real-world clinical dialogue.',
    stats: [
      { value: '5', label: 'NOISE DIMENSIONS SIMULATED' },
      { value: 'SOTA', label: 'EVALUATION FRAMEWORK' }
    ],
    image: '/images/research/verisim_card.png',

    // ── DETAIL EXTRAS ──
    coverImage: '/images/research/cover_verisim.png',
    metaData: [
      { label: 'DOMAIN', value: 'Medical AI & Robustness' },
      { label: 'ROLE', value: 'Co-First Author' },
      { label: 'YEAR', value: '2026' },
      { label: 'VENUE', value: 'ARR March 2026 / arXiv' }
    ],
    statusTag: {
      text: 'Under Review · ARR March 2026',
      color: 'yellow'
    },
    overview: 'Medical AI models currently achieve expert-level performance on standardized benchmarks. However, these datasets consist of clean, structured clinical vignettes. In reality, patients do not speak in pristine medical ontology—they omit crucial details, amplify symptoms, and introduce emotional noise. VeriSim is a pioneering evaluation framework built to stress-test how well AI systems perform under these actual, chaotic clinical conditions.',
    contentSections: [
      {
        id: 'abstract',
        title: '01 / THE CLINICAL EVALUATION GAP',
        paragraphs: [
          'The machine learning community heavily relies on structured, pristine datasets like MedQA or PubMedQA to evaluate medical LLMs. Consequently, frontier models routinely achieve expert-level diagnostic accuracy in sandbox environments. However, real-world clinical deployment is fundamentally different.',
          'When patients interact with diagnostic dialogue systems, they do not speak in structured medical ontology. They omit crucial historical context, amplify symptoms due to anxiety, and introduce conversational distractions. We recognized a critical safety gap: passing a clean medical exam does not guarantee a model is robust enough to diagnose a real, chaotic human.'
        ]
      },
      {
        id: 'methodology',
        title: '02 / THE VERISIM ARCHITECTURE',
        paragraphs: [
          'To bridge this gap, we engineered VeriSim—a highly configurable evaluation framework that algorithmically injects distinct, clinically realistic noise profiles into standard medical benchmarks.',
          'Moving beyond simple adversarial prompt injections, VeriSim utilizes LLMs to simulate genuine human cognitive and communicative behaviors. The pipeline systematically introduces varying degrees of symptom exaggeration, critical omission, colloquial phrasing, and emotional distractors, transforming sterile vignettes into rigorous, adversarial stress tests.'
        ]
      },
      {
        id: 'results',
        title: '03 / EMPIRICAL FINDINGS & DEGRADATION',
        paragraphs: [
          'Our evaluations across leading open-weight medical models (including variants of Llama and Qwen) revealed a severe fragility in the current paradigm. When subjected to realistic patient noise profiles, the diagnostic accuracy and clinical reasoning capabilities of state-of-the-art systems degraded precipitously.',
          'Models that exhibited flawless logic on clean data were frequently derailed by non-medical context or lay terminology. The data clearly demonstrates that current evaluation standards drastically overestimate the clinical readiness of frontier models.'
        ]
      },
      {
        id: 'impact',
        title: '04 / REDEFINING CLINICAL SAFETY',
        paragraphs: [
          'For AI to be safely integrated into healthcare infrastructure, it must be resilient to human imperfection. VeriSim shifts the evaluation paradigm from static question-answering to dynamic, noisy simulation.',
          'By providing a scalable, open-source blueprint for stress-testing medical models against the messy reality of patient communication, this framework establishes a new, zero-trust baseline for evaluating medical AI safety and robustness.'
        ]
      }
    ]
  },
  {
    slug: 'lvlm-hallucination-mitigation',
    featured: true, // ← Also featured on the Home Page scroll
    labels: ['MULTIMODAL AI', 'LVLMs', 'EVALUATION MATRIX'],
    title: 'Beyond the Benchmarks',
    description:
      'A systematic audit of hallucination mitigation in Large Vision-Language Models (LVLMs), investigating whether current SOTA techniques actually improve visual grounding or simply overfit to narrow benchmarks at the cost of general intelligence.',
    stats: [
      { value: '3D Matrix', label: 'EVALUATION ARCHITECTURE' },
      { value: 'Capability Tax', label: 'TRADE-OFF METRIC' }
    ],
    image: '/images/gallery/lvlm-card.png',
    coverImage: '/images/gallery/lvlm-cover.png',
    metaData: [
      { label: 'DOMAIN', value: 'Multimodal Robustness' },
      { label: 'ROLE', value: 'Equal Second Contributor' },
      { label: 'YEAR', value: '2026' },
      { label: 'VENUE', value: 'In Progress' }
    ],
    statusTag: {
      text: 'Active Research',
      color: 'gray'
    },
    overview: 'Large Vision-Language Models (LVLMs) consistently hallucinate text that is factually disconnected from their visual inputs. While the industry has proposed numerous mitigation strategies, this project—led by Mehrdad Fazli, with Sina Mansouri and myself as equal core contributors—conducts an "honest" evaluation of the field. We aim to determine if SOTA mitigation methods truly resolve the visual-linguistic disconnect, or if they are merely shifting output distributions to "game" saturated benchmarks.',
    contentSections: [
      {
        id: 'abstract',
        title: '01 / THE CAPABILITY TAX HYPOTHESIS',
        paragraphs: [
          'Current hallucination mitigation research suffers from domain narrowness, heavily relying on standard photographic benchmarks like POPE or MME. Our core hypothesis is that these fixes are often "benchmark-shallow".',
          'We introduce the "Capability Tax Hypothesis": the premise that forcing a model to reduce hallucinations on specific benchmarks degrades its broader intelligence. By aggressively tuning an LVLM to stop hallucinating objects, we risk crippling its deeper cognitive abilities—such as spatial reasoning, counting, and abstract data interpretation (e.g., reading graphs and mathematical notations).'
        ]
      },
      {
        id: 'methodology',
        title: '02 / THE 3D EVALUATION MATRIX',
        paragraphs: [
          'To expose these trade-offs, we engineered a rigorous 3D evaluation matrix testing every combination of Base Model, Baseline Mitigation, and Benchmark.',
          'We evaluate frontier architectures (including LLaVA 1.5, InstructBLIP, and Qwen2.5-VL) against SOTA mitigation algorithms like VCD, PAI, and AGLA. Crucially, we test these combinations not just on standard hallucination datasets (CHAIR, AMBER), but on complex non-hallucination reasoning benchmarks (TaskGalaxy) to quantitatively measure the capability drop-off.'
        ]
      },
      {
        id: 'current-status',
        title: '03 / PRELIMINARY INSIGHTS & ENGINEERING',
        paragraphs: [
          'Currently, I am focused on the deployment and reproduction of complex baselines like PAI and AGLA onto the LLaVA 1.5 architecture.',
          'The ultimate outcome of this matrix evaluation is a comprehensive "Failure Mode Catalog"—a robust collection of visual-linguistic examples proving where current SOTA methods fail to maintain faithfulness. This provides quantitative evidence of whether reducing hallucinations actively "hurts" the model\'s overall IQ, establishing a zero-trust baseline for future multimodal alignment.'
        ]
      }
    ]
  },
  {
    slug: 'batch-prompting-reasoning',
    labels: ['LLM REASONING', 'INFERENCE OPTIMIZATION', 'BATCH PROMPTING'],
    title: 'Reasoning Under Constraint',
    description:
      'Investigating how batch prompting acts as an implicit regularizer during inference, suppressing the "overthinking" phenomenon in frontier reasoning models to dramatically improve efficiency without sacrificing accuracy.',
    stats: [
      { value: '76%', label: 'REASONING TOKEN REDUCTION' },
      { value: '4.5x', label: 'COST EFFICIENCY GAIN' }
    ],
    image: '/images/gallery/adaptive-compute-card.png',
    coverImage: '/images/gallery/adaptive-compute.png',
    metaData: [
      { label: 'DOMAIN', value: 'Model Reasoning & Efficiency' },
      { label: 'ROLE', value: 'Co-Author (8th)' },
      { label: 'YEAR', value: '2026' },
      { label: 'VENUE', value: 'ICLR 2026 Workshop on LLM Reasoning' }
    ],
    statusTag: {
      text: 'Accepted · ICLR 2026',
      color: 'green'
    },
    overview: 'Large Reasoning Models (LRMs) achieve strong performance through explicit chain-of-thought reasoning but suffer from overthinking: generating excessive reasoning tokens even for trivial queries. This overthinking inflates cost and can be self-defeating, as models enter recursive self-doubt loops that exhaust token budgets without producing an answer, causing API timeouts that directly hurt accuracy. We discovered that batch prompting acts as an effective implicit regularizer that suppresses this overthinking entirely at inference time.',
    contentSections: [
      {
        id: 'abstract',
        title: '01 / THE OVERTHINKING PHENOMENON',
        paragraphs: [
          'Frontier reasoning models frequently generate thousands of reasoning tokens for trivial queries. Beyond the massive economic cost for API-based deployments, this behavior actively degrades performance.',
          'Models often derive the correct answer early, but then spiral into redundant rechecking, irrelevant tangents, and self-doubt. We found that attempting to fix this with explicit prompt constraints (e.g., "Use no more than 100 tokens in thinking") completely fails; models either ignore the instructions or drastically sacrifice accuracy.'
        ],
        image: '/images/research/research5_fig1.png',
      },
      {
        id: 'methodology',
        title: '02 / IMPLICIT REGULARIZATION VIA BATCHING',
        paragraphs: [
          'We discovered a surprising alternative: batch prompting, originally introduced for throughput optimization, serves as an implicit regularizer that suppresses overthinking.',
          'When multiple queries are presented together, the shared context creates a soft behavioral constraint. The model distributes its reasoning effort across all questions rather than exhaustively analyzing each one, analogous to how humans abbreviate reasoning when juggling multiple tasks under time pressure.'
        ],
        image: '/images/research/research5_fig2.png',
      },
      {
        id: 'results',
        title: '03 / EMPIRICAL FINDINGS',
        paragraphs: [
          'We conducted a comprehensive empirical study across 13 diverse benchmarks spanning arithmetic, structured extraction, and scientific tasks using DeepSeek-R1 and OpenAI-o1.',
          'Batch prompting reduced reasoning tokens by 76% (from 2,950 to 710 tokens), on average, while preserving or improving accuracy. This ~4.5x reduction in reasoning tokens is achieved with zero model modification, requiring only a change in how queries are presented.'
        ],
        image: '/images/research/research5_fig3.png',
      },
      {
        id: 'impact',
        title: '04 / BEHAVIORAL SHIFTS',
        paragraphs: [
          'Beyond sheer efficiency, batching induces highly beneficial cognitive shifts. It effectively suppresses hedging behavior, drastically reducing tokens like "wait" or "let me double-check" that signal metacognitive loops.',
          'Furthermore, it enables pattern induction. When solving similar queries together, models generalize patterns from earlier examples to solve later ones in the same batch, providing a robust, model-agnostic technique for efficient LRM deployment.'
        ],
        image: '/images/research/research5_fig4.png',
      }
    ]
  }
];

export default featuredResearch;
