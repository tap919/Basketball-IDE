// Medical Research & Disease Cure Pipeline Templates
// Basketball-to-Biotech Translation for Breakthrough Research

import { PipelineTemplate, ExperimentCategory } from './types';

// Extended categories for medical research
export const medicalCategories: { id: ExperimentCategory; name: string; description: string; icon: string; breakthrough: string }[] = [
  {
    id: 'disease-cure',
    name: 'Disease Cure Research',
    description: 'Target disease mechanisms and develop curative therapies',
    icon: 'Heart',
    breakthrough: 'Potential to cure currently incurable diseases'
  },
  {
    id: 'virus-mutation',
    name: 'Virus & Mutation Analysis',
    description: 'Track viral evolution and design countermeasures',
    icon: 'Bug',
    breakthrough: 'Universal vaccines and antiviral therapies'
  },
  {
    id: 'gene-therapy',
    name: 'Gene Therapy & Editing',
    description: 'Correct genetic defects and engineer therapeutic genes',
    icon: 'Dna',
    breakthrough: 'One-time cures for genetic diseases'
  },
  {
    id: 'physiology-modeling',
    name: 'Human Physiology Modeling',
    description: 'Simulate organ systems and drug-body interactions',
    icon: 'Activity',
    breakthrough: 'Personalized medicine and treatment optimization'
  },
  {
    id: 'cancer-research',
    name: 'Cancer Research',
    description: 'Target tumor mechanisms and develop immunotherapies',
    icon: 'Target',
    breakthrough: 'Cancer eradication strategies'
  },
  {
    id: 'neurodegenerative',
    name: 'Neurodegenerative Diseases',
    description: 'Combat Alzheimer\'s, Parkinson\'s, and related conditions',
    icon: 'Brain',
    breakthrough: 'Reverse cognitive decline'
  },
  {
    id: 'rare-disease',
    name: 'Rare Disease Research',
    description: 'Develop therapies for orphan diseases',
    icon: 'Sparkles',
    breakthrough: 'Cures for underserved patient populations'
  }
];

export const medicalPipelineTemplates: PipelineTemplate[] = [
  // ============================================
  // DISEASE CURE RESEARCH
  // ============================================
  
  {
    id: 'alzheimer-reversal',
    name: 'Alzheimer\'s Disease Reversal Pipeline',
    category: 'disease-cure',
    description: 'Multi-target approach to clear amyloid plaques, restore synaptic function, and reverse cognitive decline. This pipeline integrates biomarker discovery, drug repurposing, and combination therapy optimization to address the multifactorial nature of Alzheimer\'s disease.',
    basketballContext: 'Just as a team must work together to overcome a deficit, curing Alzheimer\'s requires coordinated attack on multiple pathological mechanisms simultaneously - like a full-court press that attacks from all angles.',
    biotechApplication: 'Identify synergistic drug combinations that clear amyloid-beta plaques, reduce tau tangles, restore synaptic plasticity, and reconstitute the blood-brain barrier. Uses patient-derived neurons for personalized treatment validation.',
    estimatedDuration: '45-90 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'diseaseStage',
        name: 'diseaseStage',
        label: 'Disease Stage',
        type: 'select',
        defaultValue: 'early',
        options: [
          { value: 'preclinical', label: 'Preclinical (Prevention)' },
          { value: 'early', label: 'Early Stage (MCI)' },
          { value: 'moderate', label: 'Moderate AD' },
          { value: 'severe', label: 'Severe AD' }
        ],
        basketballAnalogy: 'Game situation (early lead vs comeback attempt)',
        biotechEquivalent: 'Disease progression stage determines intervention strategy'
      },
      {
        id: 'targetMechanisms',
        name: 'targetMechanisms',
        label: 'Target Mechanisms',
        type: 'select',
        defaultValue: 'multi-target',
        options: [
          { value: 'amyloid', label: 'Amyloid-β Clearance Only' },
          { value: 'tau', label: 'Tau Tangle Reduction Only' },
          { value: 'synaptic', label: 'Synaptic Restoration Only' },
          { value: 'multi-target', label: 'Multi-Target Combination' }
        ],
        basketballAnalogy: 'Offensive focus (inside game vs outside shooting vs balanced)',
        biotechEquivalent: 'Therapeutic mechanism selection'
      },
      {
        id: 'combinationSize',
        name: 'combinationSize',
        label: 'Drug Combination Size',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 6,
        basketballAnalogy: 'Number of players in the play',
        biotechEquivalent: 'Polypharmacy complexity'
      }
    ],
    steps: [
      {
        id: 'biomarker-load',
        name: 'Load Patient Biomarkers',
        description: 'Import CSF, blood, and imaging biomarkers for personalized analysis',
        basketballAnalogy: 'Scouting report - understanding opponent strengths and weaknesses',
        biotechTranslation: 'Establishing patient-specific disease profile'
      },
      {
        id: 'mechanism-mapping',
        name: 'Disease Mechanism Mapping',
        description: 'Map patient-specific pathological pathways',
        basketballAnalogy: 'Analyzing opponent defensive schemes',
        biotechTranslation: 'Identifying druggable targets unique to patient'
      },
      {
        id: 'drug-screening',
        name: 'High-Throughput Drug Screening',
        description: 'Screen FDA-approved drugs for repurposing potential',
        basketballAnalogy: 'Testing different offensive sets',
        biotechTranslation: 'Rapid identification of approved drugs for new uses'
      },
      {
        id: 'combination-optimization',
        name: 'Combination Therapy Optimization',
        description: 'Find synergistic drug combinations using AI',
        basketballAnalogy: 'Developing the perfect play with multiple options',
        biotechTranslation: 'Computational synergy prediction and validation'
      },
      {
        id: 'bbb-penetration',
        name: 'Blood-Brain Barrier Analysis',
        description: 'Optimize drugs for CNS penetration',
        basketballAnalogy: 'Getting through a tight defense',
        biotechTranslation: 'Ensuring therapeutic concentrations reach brain'
      },
      {
        id: 'safety-profiling',
        name: 'Safety & Toxicity Profiling',
        description: 'Assess combination safety profile',
        basketballAnalogy: 'Avoiding foul trouble',
        biotechTranslation: 'Predicting and minimizing adverse events'
      },
      {
        id: 'dose-optimization',
        name: 'Personalized Dosing',
        description: 'Calculate optimal doses for patient genotype',
        basketballAnalogy: 'Shot selection based on defender position',
        biotechTranslation: 'Pharmacogenomic dose optimization'
      },
      {
        id: 'outcome-prediction',
        name: 'Treatment Outcome Prediction',
        description: 'Predict cognitive improvement trajectory',
        basketballAnalogy: 'Game outcome prediction',
        biotechTranslation: 'Machine learning-based response prediction'
      }
    ]
  },

  {
    id: 'cancer-immunotherapy',
    name: 'CAR-T Cell Therapy Optimization',
    category: 'cancer-research',
    description: 'Design and optimize chimeric antigen receptor T-cell therapies for solid tumors. This pipeline addresses the key challenges of CAR-T therapy: tumor infiltration, antigen escape, and T-cell exhaustion.',
    basketballContext: 'Like training elite defenders who can recognize and stop any offensive player, CAR-T cells must be engineered to identify cancer cells, infiltrate tumors, and sustain their attack without burning out.',
    biotechApplication: 'Engineer patient T-cells with optimized CAR constructs for maximum tumor killing while minimizing off-target toxicity and cytokine release syndrome.',
    estimatedDuration: '60-120 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'cancerType',
        name: 'cancerType',
        label: 'Cancer Type',
        type: 'select',
        defaultValue: 'pancreatic',
        options: [
          { value: 'pancreatic', label: 'Pancreatic Cancer' },
          { value: 'glioblastoma', label: 'Glioblastoma' },
          { value: 'ovarian', label: 'Ovarian Cancer' },
          { value: 'triple-negative', label: 'Triple-Negative Breast Cancer' },
          { value: 'mesothelioma', label: 'Mesothelioma' }
        ],
        basketballAnalogy: 'Type of opponent (style of play)',
        biotechEquivalent: 'Tumor microenvironment characteristics'
      },
      {
        id: 'targetAntigens',
        name: 'targetAntigens',
        label: 'Target Antigens',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 4,
        basketballAnalogy: 'Number of defensive schemes prepared',
        biotechEquivalent: 'Antigen targeting strategy (prevents escape)'
      },
      {
        id: 'persistenceGoal',
        name: 'persistenceGoal',
        label: 'T-Cell Persistence (months)',
        type: 'number',
        defaultValue: 12,
        min: 3,
        max: 36,
        basketballAnalogy: 'Player stamina and career longevity',
        biotechEquivalent: 'Duration of therapeutic response'
      }
    ],
    steps: [
      {
        id: 'tumor-profiling',
        name: 'Tumor Antigen Profiling',
        description: 'Identify tumor-specific antigens for targeting',
        basketballAnalogy: 'Scouting opponent star players',
        biotechTranslation: 'Single-cell sequencing for antigen discovery'
      },
      {
        id: 'car-design',
        name: 'CAR Construct Design',
        description: 'Design optimal CAR architecture',
        basketballAnalogy: 'Designing the defensive scheme',
        biotechTranslation: 'Signal domain optimization for T-cell activation'
      },
      {
        id: 'exhaustion-prevention',
        name: 'Exhaustion Resistance Engineering',
        description: 'Add exhaustion-resistant modifications',
        basketballAnalogy: 'Conditioning program for fourth quarter stamina',
        biotechTranslation: 'PD-1 knockout, cytokine armor, metabolic optimization'
      },
      {
        id: 'infiltration-enhancement',
        name: 'Tumor Infiltration Enhancement',
        description: 'Optimize T-cell tumor homing',
        basketballAnalogy: 'Breaking through the press',
        biotechTranslation: 'Chemokine receptor matching, ECM degradation'
      },
      {
        id: 'safety-switches',
        name: 'Safety Switch Integration',
        description: 'Add suicide switches for safety',
        basketballAnalogy: 'Emergency timeout',
        biotechTranslation: 'iCasp9, EGFRt for controlled elimination'
      },
      {
        id: 'manufacturing-sim',
        name: 'Manufacturing Simulation',
        description: 'Simulate large-scale CAR-T production',
        basketballAnalogy: 'Team training camp logistics',
        biotechTranslation: 'Process optimization for GMP production'
      },
      {
        id: 'response-prediction',
        name: 'Response Prediction',
        description: 'Predict patient response and CRS risk',
        basketballAnalogy: 'Game outcome prediction',
        biotechTranslation: 'AI-based response modeling'
      }
    ]
  },

  // ============================================
  // VIRUS & MUTATION ANALYSIS
  // ============================================

  {
    id: 'universal-vaccine',
    name: 'Universal Virus Vaccine Design',
    category: 'virus-mutation',
    description: 'Design vaccines targeting conserved viral regions to provide broad protection against current and future viral variants. Uses structural biology and machine learning to identify immutable viral epitopes.',
    basketballContext: 'Like developing a defensive strategy that works against any offensive play, a universal vaccine targets parts of the virus that cannot mutate without losing function - the fundamental weaknesses.',
    biotechApplication: 'Identify conserved epitopes across viral families, design immunogens that elicit broadly neutralizing antibodies, and predict future viral evolution pathways.',
    estimatedDuration: '40-75 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'virusFamily',
        name: 'virusFamily',
        label: 'Virus Family',
        type: 'select',
        defaultValue: 'coronavirus',
        options: [
          { value: 'coronavirus', label: 'Coronaviridae (COVID, MERS, SARS)' },
          { value: 'influenza', label: 'Orthomyxoviridae (Influenza)' },
          { value: 'hiv', label: 'Retroviridae (HIV)' },
          { value: 'rsv', label: 'Pneumoviridae (RSV)' },
          { value: 'dengue', label: 'Flaviviridae (Dengue, Zika)' }
        ],
        basketballAnalogy: 'League/conference of opponents',
        biotechEquivalent: 'Viral family for broad-spectrum targeting'
      },
      {
        id: 'mutationTracking',
        name: 'mutationTracking',
        label: 'Mutation Tracking Depth',
        type: 'number',
        defaultValue: 10000,
        min: 1000,
        max: 100000,
        basketballAnalogy: 'Number of game tapes analyzed',
        biotechEquivalent: 'Viral sequences analyzed for conservation'
      },
      {
        id: 'platformType',
        name: 'platformType',
        label: 'Vaccine Platform',
        type: 'select',
        defaultValue: 'mRNA',
        options: [
          { value: 'mRNA', label: 'mRNA Vaccine' },
          { value: 'protein', label: 'Protein Subunit' },
          { value: 'viral-vector', label: 'Viral Vector' },
          { value: 'nanoparticle', label: 'Nanoparticle Display' }
        ],
        basketballAnalogy: 'Play style (fast break vs set offense)',
        biotechEquivalent: 'Vaccine delivery technology'
      }
    ],
    steps: [
      {
        id: 'sequence-aggregation',
        name: 'Viral Sequence Aggregation',
        description: 'Aggregate all known viral sequences',
        basketballAnalogy: 'Gathering all game footage',
        biotechTranslation: 'Database mining for comprehensive sequence coverage'
      },
      {
        id: 'conservation-analysis',
        name: 'Conservation Analysis',
        description: 'Identify conserved regions under purifying selection',
        basketballAnalogy: 'Finding opponent\'s predictable plays',
        biotechTranslation: 'Evolutionary constraint mapping'
      },
      {
        id: 'structure-modeling',
        name: 'Structural Modeling',
        description: 'Model 3D structure of target proteins',
        basketballAnalogy: 'Analyzing court positioning',
        biotechTranslation: 'AlphaFold2 structure prediction'
      },
      {
        id: 'epitope-prediction',
        name: 'Epitope Prediction',
        description: 'Predict B-cell and T-cell epitopes',
        basketballAnalogy: 'Identifying defensive sweet spots',
        biotechTranslation: 'Immunoinformatics for epitope selection'
      },
      {
        id: 'immunogen-design',
        name: 'Immunogen Design',
        description: 'Design optimized immunogen constructs',
        basketballAnalogy: 'Creating the perfect defensive formation',
        biotechTranslation: 'Structure-based antigen engineering'
      },
      {
        id: 'escape-prediction',
        name: 'Escape Mutation Prediction',
        description: 'Predict potential viral escape pathways',
        basketballAnalogy: 'Anticipating opponent adjustments',
        biotechTranslation: 'Deep mutational scanning simulation'
      },
      {
        id: 'immunogenicity-sim',
        name: 'Immunogenicity Simulation',
        description: 'Simulate immune response to vaccine',
        basketballAnalogy: 'Practice game simulation',
        biotechTranslation: 'In silico immune response modeling'
      }
    ]
  },

  {
    id: 'antiviral-discovery',
    name: 'Broad-Spectrum Antiviral Discovery',
    category: 'virus-mutation',
    description: 'Discover host-targeted antivirals that work against multiple viruses by targeting conserved host pathways essential for viral replication. This approach minimizes resistance development.',
    basketballContext: 'Instead of defending against specific plays, this strategy removes the court conditions that allow any offense to function - a fundamental approach that works against all opponents.',
    biotechApplication: 'Identify host factors essential for viral replication, screen compounds that safely inhibit these factors, and optimize for broad-spectrum activity with minimal host toxicity.',
    estimatedDuration: '35-60 minutes',
    difficulty: 'intermediate',
    parameters: [
      {
        id: 'targetStrategy',
        name: 'targetStrategy',
        label: 'Target Strategy',
        type: 'select',
        defaultValue: 'host-targeted',
        options: [
          { value: 'host-targeted', label: 'Host-Targeted (Resistance-Proof)' },
          { value: 'viral-essential', label: 'Viral Essential Proteins' },
          { value: 'combination', label: 'Host + Viral Combination' }
        ],
        basketballAnalogy: 'Defense type (man-to-man vs zone vs hybrid)',
        biotechEquivalent: 'Antiviral targeting approach'
      },
      {
        id: 'virusTargets',
        name: 'virusTargets',
        label: 'Number of Virus Targets',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 20,
        basketballAnalogy: 'Number of opponents to prepare for',
        biotechEquivalent: 'Spectrum breadth target'
      },
      {
        id: 'safetyThreshold',
        name: 'safetyThreshold',
        label: 'Safety Threshold (TI)',
        type: 'number',
        defaultValue: 100,
        min: 10,
        max: 1000,
        basketballAnalogy: 'Acceptable foul rate',
        biotechEquivalent: 'Minimum therapeutic index'
      }
    ],
    steps: [
      {
        id: 'host-factor-id',
        name: 'Host Factor Identification',
        description: 'Identify host proteins required for viral replication',
        basketballAnalogy: 'Finding court conditions that enable opponents',
        biotechTranslation: 'CRISPR screening data integration'
      },
      {
        id: 'pathway-analysis',
        name: 'Common Pathway Analysis',
        description: 'Find pathways shared across virus families',
        basketballAnalogy: 'Finding common offensive patterns',
        biotechTranslation: 'Network analysis for essential nodes'
      },
      {
        id: 'compound-screening',
        name: 'Compound Library Screening',
        description: 'Screen for pathway inhibitors',
        basketballAnalogy: 'Testing defensive strategies',
        biotechTranslation: 'Virtual docking + AI activity prediction'
      },
      {
        id: 'selectivity-optimization',
        name: 'Selectivity Optimization',
        description: 'Maximize antiviral vs host activity ratio',
        basketballAnalogy: 'Perfecting defensive positioning',
        biotechTranslation: 'Medicinal chemistry optimization'
      },
      {
        id: 'resistance-profiling',
        name: 'Resistance Barrier Assessment',
        description: 'Assess likelihood of resistance development',
        basketballAnalogy: 'Checking if opponent can adjust',
        biotechTranslation: 'Evolutionary constraint analysis'
      },
      {
        id: 'pk-optimization',
        name: 'Pharmacokinetic Optimization',
        description: 'Optimize drug-like properties',
        basketballAnalogy: 'Player endurance optimization',
        biotechTranslation: 'ADME profiling and optimization'
      }
    ]
  },

  // ============================================
  // GENE THERAPY & EDITING
  // ============================================

  {
    id: 'crispr-cure-design',
    name: 'CRISPR Gene Cure Designer',
    category: 'gene-therapy',
    description: 'Design precise CRISPR-based gene therapies to correct disease-causing mutations. Includes off-target prediction, delivery optimization, and immune evasion strategies for one-time cures.',
    basketballContext: 'Like a perfect free throw that corrects a scoring deficit, CRISPR gene editing precisely corrects genetic errors. The goal is a one-time intervention that permanently fixes the underlying cause.',
    biotechApplication: 'Design guide RNAs for precise gene correction, select optimal delivery vectors, minimize off-target effects, and predict immune responses for clinical translation.',
    estimatedDuration: '50-90 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'diseaseTarget',
        name: 'diseaseTarget',
        label: 'Disease Target',
        type: 'select',
        defaultValue: 'sickle-cell',
        options: [
          { value: 'sickle-cell', label: 'Sickle Cell Disease' },
          { value: 'duchenne', label: 'Duchenne Muscular Dystrophy' },
          { value: 'cystic-fibrosis', label: 'Cystic Fibrosis' },
          { value: 'huntingtons', label: 'Huntington\'s Disease' },
          { value: 'beta-thalassemia', label: 'β-Thalassemia' },
          { value: 'hemophilia', label: 'Hemophilia A/B' },
          { value: 'lhon', label: 'Leber Hereditary Optic Neuropathy' }
        ],
        basketballAnalogy: 'The game/championship we\'re playing for',
        biotechEquivalent: 'Genetic disease to cure'
      },
      {
        id: 'editingStrategy',
        name: 'editingStrategy',
        label: 'Editing Strategy',
        type: 'select',
        defaultValue: 'homology-directed',
        options: [
          { value: 'knockout', label: 'Gene Knockout (Loss-of-Function)' },
          { value: 'homology-directed', label: 'HDR Correction' },
          { value: 'base-editing', label: 'Base Editing (No DSB)' },
          { value: 'prime-editing', label: 'Prime Editing' }
        ],
        basketballAnalogy: 'Type of shot (dunk, jump shot, layup)',
        biotechEquivalent: 'CRISPR editing modality'
      },
      {
        id: 'deliveryVector',
        name: 'deliveryVector',
        label: 'Delivery Vector',
        type: 'select',
        defaultValue: 'aav',
        options: [
          { value: 'aav', label: 'AAV (In Vivo)' },
          { value: 'lnp', label: 'Lipid Nanoparticle (mRNA)' },
          { value: 'lentiviral', label: 'Lentiviral (Ex Vivo)' },
          { value: 'rnp', label: 'RNP Electroporation (Ex Vivo)' }
        ],
        basketballAnalogy: 'Play delivery method',
        biotechEquivalent: 'Gene therapy delivery system'
      }
    ],
    steps: [
      {
        id: 'mutation-analysis',
        name: 'Mutation Analysis',
        description: 'Analyze disease-causing mutation(s)',
        basketballAnalogy: 'Understanding the deficit to overcome',
        biotechTranslation: 'Variant pathogenicity and frequency analysis'
      },
      {
        id: 'grna-design',
        name: 'Guide RNA Design',
        description: 'Design optimal guide RNAs for target site',
        basketballAnalogy: 'Calling the perfect play',
        biotechTranslation: 'On-target efficiency maximization'
      },
      {
        id: 'off-target-prediction',
        name: 'Off-Target Prediction',
        description: 'Predict and minimize off-target sites',
        basketballAnalogy: 'Ensuring play doesn\'t create other problems',
        biotechTranslation: 'Genome-wide off-target analysis'
      },
      {
        id: 'delivery-optimization',
        name: 'Delivery Optimization',
        description: 'Optimize vector for target tissue',
        basketballAnalogy: 'Getting the ball to the right player',
        biotechTranslation: 'Tropism engineering and dosing'
      },
      {
        id: 'immune-evasion',
        name: 'Immune Evasion Design',
        description: 'Design strategies to avoid immune detection',
        basketballAnalogy: 'Avoiding the opponent\'s defense',
        biotechTranslation: 'Cas9 ortholog selection, immunogenicity reduction'
      },
      {
        id: 'efficiency-prediction',
        name: 'Editing Efficiency Prediction',
        description: 'Predict editing efficiency in target cells',
        basketballAnalogy: 'Shot success probability',
        biotechTranslation: 'Chromatin accessibility and repair pathway modeling'
      },
      {
        id: 'safety-assessment',
        name: 'Safety Assessment',
        description: 'Comprehensive safety profiling',
        basketballAnalogy: 'Risk assessment before the play',
        biotechTranslation: 'Genotoxicity and tumorigenicity prediction'
      },
      {
        id: 'clinical-trial-design',
        name: 'Clinical Trial Design',
        description: 'Design optimal clinical trial approach',
        basketballAnalogy: 'Game plan for the season',
        biotechTranslation: 'Protocol development for FDA submission'
      }
    ]
  },

  {
    id: 'gene-therapy-manufacturing',
    name: 'Gene Therapy Manufacturing Scale-Up',
    category: 'gene-therapy',
    description: 'Optimize manufacturing processes for scalable, affordable gene therapy production. Addresses the key bottleneck of bringing gene cures to patients at scale.',
    basketballContext: 'Like developing a training system that can produce elite players consistently at scale, this pipeline optimizes the manufacturing process to make gene cures accessible to all who need them.',
    biotechApplication: 'Design scalable production processes for viral vectors or mRNA therapeutics, optimize yield and quality, and reduce manufacturing costs by 10-100x.',
    estimatedDuration: '30-50 minutes',
    difficulty: 'intermediate',
    parameters: [
      {
        id: 'productType',
        name: 'productType',
        label: 'Product Type',
        type: 'select',
        defaultValue: 'aav',
        options: [
          { value: 'aav', label: 'AAV Vector' },
          { value: 'lentiviral', label: 'Lentiviral Vector' },
          { value: 'mrna', label: 'mRNA Therapeutic' },
          { value: 'cell-therapy', label: 'Cell Therapy Product' }
        ],
        basketballAnalogy: 'Type of training program',
        biotechEquivalent: 'Gene therapy modality'
      },
      {
        id: 'scaleTarget',
        name: 'scaleTarget',
        label: 'Production Scale (doses/year)',
        type: 'number',
        defaultValue: 10000,
        min: 100,
        max: 1000000,
        basketballAnalogy: 'Number of players to train',
        biotechEquivalent: 'Manufacturing capacity goal'
      },
      {
        id: 'costTarget',
        name: 'costTarget',
        label: 'Cost Target ($/dose)',
        type: 'number',
        defaultValue: 10000,
        min: 100,
        max: 1000000,
        basketballAnalogy: 'Training budget per player',
        biotechEquivalent: 'Target manufacturing cost'
      }
    ],
    steps: [
      {
        id: 'process-mapping',
        name: 'Current Process Mapping',
        description: 'Map existing manufacturing process',
        basketballAnalogy: 'Analyzing current training methods',
        biotechTranslation: 'Process flow diagram and bottleneck identification'
      },
      {
        id: 'yield-optimization',
        name: 'Yield Optimization',
        description: 'Identify opportunities to increase yield',
        basketballAnalogy: 'Improving player development success rate',
        biotechTranslation: 'DOE optimization of critical parameters'
      },
      {
        id: 'scale-up-design',
        name: 'Scale-Up Design',
        description: 'Design large-scale production system',
        basketballAnalogy: 'Expanding training to more facilities',
        biotechTranslation: 'Bioreactor and downstream scaling'
      },
      {
        id: 'quality-systems',
        name: 'Quality Systems Design',
        description: 'Design in-process and release testing',
        basketballAnalogy: 'Performance evaluation system',
        biotechTranslation: 'Potency assays and specifications'
      },
      {
        id: 'cost-modeling',
        name: 'Cost Modeling',
        description: 'Model cost of goods and identify savings',
        basketballAnalogy: 'Budget optimization',
        biotechTranslation: 'Techno-economic analysis'
      }
    ]
  },

  // ============================================
  // HUMAN PHYSIOLOGY MODELING
  // ============================================

  {
    id: 'digital-twin-therapy',
    name: 'Digital Twin Therapy Optimization',
    category: 'physiology-modeling',
    description: 'Create a computational model of individual patient physiology to predict optimal treatment regimens. Enables true personalized medicine by simulating drug responses before administration.',
    basketballContext: 'Like having a perfect simulation of how a player performs in any game situation, a digital twin lets us predict exactly how a patient will respond to any treatment before giving it.',
    biotechApplication: 'Build multi-scale physiological models incorporating genomics, proteomics, and clinical data to predict drug response, optimize dosing, and prevent adverse events.',
    estimatedDuration: '45-80 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'modelScope',
        name: 'modelScope',
        label: 'Model Scope',
        type: 'select',
        defaultValue: 'multi-organ',
        options: [
          { value: 'single-organ', label: 'Single Organ System' },
          { value: 'multi-organ', label: 'Multi-Organ System' },
          { value: 'whole-body', label: 'Whole-Body Physiome' }
        ],
        basketballAnalogy: 'Individual player vs team vs league simulation',
        biotechEquivalent: 'Physiological model complexity'
      },
      {
        id: 'diseaseContext',
        name: 'diseaseContext',
        label: 'Disease Context',
        type: 'select',
        defaultValue: 'diabetes',
        options: [
          { value: 'diabetes', label: 'Type 2 Diabetes' },
          { value: 'heart-failure', label: 'Heart Failure' },
          { value: 'ckd', label: 'Chronic Kidney Disease' },
          { value: 'autoimmune', label: 'Autoimmune Disease' }
        ],
        basketballAnalogy: 'Game situation',
        biotechEquivalent: 'Disease state for modeling'
      },
      {
        id: 'dataIntegration',
        name: 'dataIntegration',
        label: 'Data Integration Level',
        type: 'select',
        defaultValue: 'multi-omics',
        options: [
          { value: 'clinical', label: 'Clinical Data Only' },
          { value: 'genomic', label: 'Clinical + Genomic' },
          { value: 'multi-omics', label: 'Multi-Omics Integration' }
        ],
        basketballAnalogy: 'Amount of data used for simulation',
        biotechEquivalent: 'Patient data depth'
      }
    ],
    steps: [
      {
        id: 'data-ingestion',
        name: 'Patient Data Ingestion',
        description: 'Integrate multi-modal patient data',
        basketballAnalogy: 'Gathering all player statistics and history',
        biotechTranslation: 'EHR, genomic, and wearables data integration'
      },
      {
        id: 'model-construction',
        name: 'Physiological Model Construction',
        description: 'Build patient-specific physiological model',
        basketballAnalogy: 'Creating the player simulation',
        biotechTranslation: 'PBPK and QSP model parameterization'
      },
      {
        id: 'validation',
        name: 'Model Validation',
        description: 'Validate against known patient responses',
        basketballAnalogy: 'Checking simulation accuracy',
        biotechTranslation: 'Retrospective prediction accuracy'
      },
      {
        id: 'treatment-simulation',
        name: 'Treatment Simulation',
        description: 'Simulate candidate treatment responses',
        basketballAnalogy: 'Simulating different game strategies',
        biotechTranslation: 'Drug response and interaction prediction'
      },
      {
        id: 'optimization',
        name: 'Treatment Optimization',
        description: 'Find optimal treatment regimen',
        basketballAnalogy: 'Finding the winning strategy',
        biotechTranslation: 'Multi-objective optimization algorithm'
      },
      {
        id: 'risk-assessment',
        name: 'Risk Assessment',
        description: 'Assess risks of proposed treatment',
        basketballAnalogy: 'Risk/reward analysis',
        biotechTranslation: 'Adverse event probability modeling'
      }
    ]
  },

  {
    id: 'organ-regeneration',
    name: 'Organ Regeneration Protocol Designer',
    category: 'physiology-modeling',
    description: 'Design protocols for growing patient-specific organs using stem cells and tissue engineering. Aims to eliminate transplant waiting lists and rejection.',
    basketballContext: 'Like developing a training program that can create a new star player from scratch, organ regeneration grows new functional organs from a patient\'s own cells.',
    biotechApplication: 'Design differentiation protocols, bioreactor conditions, and vascularization strategies to grow functional organs for transplantation.',
    estimatedDuration: '60-100 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'organType',
        name: 'organType',
        label: 'Target Organ',
        type: 'select',
        defaultValue: 'kidney',
        options: [
          { value: 'kidney', label: 'Kidney' },
          { value: 'liver', label: 'Liver' },
          { value: 'heart', label: 'Heart' },
          { value: 'lung', label: 'Lung' },
          { value: 'pancreas', label: 'Pancreas (Islets)' }
        ],
        basketballAnalogy: 'Position to develop',
        biotechEquivalent: 'Organ system to regenerate'
      },
      {
        id: 'cellSource',
        name: 'cellSource',
        label: 'Cell Source',
        type: 'select',
        defaultValue: 'ipsc',
        options: [
          { value: 'ipsc', label: 'Patient iPSCs' },
          { value: 'adult-stem', label: 'Adult Stem Cells' },
          { value: 'direct-reprogram', label: 'Direct Reprogramming' }
        ],
        basketballAnalogy: 'Player recruitment source',
        biotechEquivalent: 'Starting cell population'
      },
      {
        id: 'maturationTarget',
        name: 'maturationTarget',
        label: 'Maturation Target (%)',
        type: 'number',
        defaultValue: 80,
        min: 50,
        max: 100,
        basketballAnalogy: 'Development completeness goal',
        biotechEquivalent: 'Adult organ functionality target'
      }
    ],
    steps: [
      {
        id: 'blueprint-analysis',
        name: 'Organ Blueprint Analysis',
        description: 'Analyze native organ structure and function',
        basketballAnalogy: 'Understanding the ideal player profile',
        biotechTranslation: 'Single-cell atlas integration'
      },
      {
        id: 'differentiation-design',
        name: 'Differentiation Protocol Design',
        description: 'Design cell differentiation protocol',
        basketballAnalogy: 'Developing core skills',
        biotechTranslation: 'Signaling pathway optimization'
      },
      {
        id: 'scaffold-design',
        name: 'Scaffold/Bioink Design',
        description: 'Design 3D printing scaffold',
        basketballAnalogy: 'Creating practice facilities',
        biotechTranslation: 'Biomaterial and architecture optimization'
      },
      {
        id: 'vascularization',
        name: 'Vascularization Strategy',
        description: 'Design blood vessel formation strategy',
        basketballAnalogy: 'Ensuring player has proper support',
        biotechTranslation: 'Angiogenesis and perfusion engineering'
      },
      {
        id: 'bioreactor-design',
        name: 'Bioreactor Conditions',
        description: 'Optimize growth conditions',
        basketballAnalogy: 'Training environment optimization',
        biotechTranslation: 'Perfusion, oxygen, nutrient optimization'
      },
      {
        id: 'quality-assessment',
        name: 'Quality Assessment',
        description: 'Assess organ functionality',
        basketballAnalogy: 'Player evaluation metrics',
        biotechTranslation: 'Function and safety testing protocols'
      }
    ]
  },

  // ============================================
  // NEURODEGENERATIVE DISEASES
  // ============================================

  {
    id: 'parkinsons-reversal',
    name: 'Parkinson\'s Disease Reversal Pipeline',
    category: 'neurodegenerative',
    description: 'Multi-modal approach to halt and reverse Parkinson\'s progression by replacing lost dopamine neurons, clearing α-synuclein aggregates, and restoring motor function.',
    basketballContext: 'Like rebuilding a team that lost its star point guard, this pipeline replaces lost neurons while addressing the underlying disease process that caused the loss.',
    biotechApplication: 'Develop stem cell-derived dopamine neuron replacement combined with α-synuclein clearance and neuroprotection for comprehensive disease reversal.',
    estimatedDuration: '50-85 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'pdStage',
        name: 'pdStage',
        label: 'Disease Stage',
        type: 'select',
        defaultValue: 'moderate',
        options: [
          { value: 'early', label: 'Early PD (Hoehn-Yahr 1-2)' },
          { value: 'moderate', label: 'Moderate PD (Hoehn-Yahr 3)' },
          { value: 'advanced', label: 'Advanced PD (Hoehn-Yahr 4-5)' }
        ],
        basketballAnalogy: 'Game deficit size',
        biotechEquivalent: 'Disease severity determines approach'
      },
      {
        id: 'therapeuticApproach',
        name: 'therapeuticApproach',
        label: 'Therapeutic Approach',
        type: 'select',
        defaultValue: 'combination',
        options: [
          { value: 'cell-replacement', label: 'Cell Replacement Only' },
          { value: 'aggregate-clearance', label: 'α-Synuclein Clearance Only' },
          { value: 'combination', label: 'Combined Approach' }
        ],
        basketballAnalogy: 'Comeback strategy type',
        biotechEquivalent: 'Treatment modality selection'
      }
    ],
    steps: [
      {
        id: 'patient-profiling',
        name: 'Patient Profiling',
        description: 'Characterize patient\'s disease phenotype',
        basketballAnalogy: 'Assessing team\'s current state',
        biotechTranslation: 'Biomarker and genetic profiling'
      },
      {
        id: 'neuron-differentiation',
        name: 'Dopamine Neuron Generation',
        description: 'Generate patient-specific dopamine neurons',
        basketballAnalogy: 'Developing replacement players',
        biotechTranslation: 'iPSC differentiation to midbrain neurons'
      },
      {
        id: 'aggregate-targeting',
        name: 'α-Synuclein Targeting',
        description: 'Design aggregate clearance approach',
        basketballAnalogy: 'Removing the root cause of losses',
        biotechTranslation: 'Antibody or small molecule aggregate clearance'
      },
      {
        id: 'delivery-optimization',
        name: 'Delivery Optimization',
        description: 'Optimize brain delivery methods',
        basketballAnalogy: 'Getting players on the court',
        biotechTranslation: 'Stereotactic injection optimization'
      },
      {
        id: 'integration-prediction',
        name: 'Integration Prediction',
        description: 'Predict neuron integration success',
        basketballAnalogy: 'Predicting player fit with team',
        biotechTranslation: 'Synaptic integration modeling'
      },
      {
        id: 'motor-recovery',
        name: 'Motor Recovery Simulation',
        description: 'Simulate expected motor improvement',
        basketballAnalogy: 'Predicting team performance improvement',
        biotechTranslation: 'UPDRS score improvement prediction'
      }
    ]
  },

  // ============================================
  // RARE DISEASE RESEARCH
  // ============================================

  {
    id: 'rare-disease-nlp',
    name: 'Rare Disease Treatment Discovery',
    category: 'rare-disease',
    description: 'Use AI to discover treatments for rare/orphan diseases by mining medical literature, identifying drug repurposing opportunities, and designing patient-specific therapies.',
    basketballContext: 'Like finding the hidden strengths of overlooked players, this pipeline finds treatment opportunities for diseases that have been ignored by traditional drug development.',
    biotechApplication: 'Comprehensive analysis of rare disease mechanisms, natural history, and treatment opportunities using AI-powered literature mining and computational drug design.',
    estimatedDuration: '40-70 minutes',
    difficulty: 'intermediate',
    parameters: [
      {
        id: 'rareDisease',
        name: 'rareDisease',
        label: 'Disease',
        type: 'string',
        defaultValue: 'Friedreich\'s Ataxia',
        basketballAnalogy: 'The specific challenge',
        biotechEquivalent: 'Target rare disease'
      },
      {
        id: 'searchDepth',
        name: 'searchDepth',
        label: 'Literature Search Depth',
        type: 'number',
        defaultValue: 1000,
        min: 100,
        max: 10000,
        basketballAnalogy: 'How much footage to analyze',
        biotechEquivalent: 'Number of papers to analyze'
      },
      {
        id: 'approachType',
        name: 'approachType',
        label: 'Approach Type',
        type: 'select',
        defaultValue: 'repurposing',
        options: [
          { value: 'repurposing', label: 'Drug Repurposing' },
          { value: 'gene-therapy', label: 'Gene Therapy Design' },
          { value: 'small-molecule', label: 'New Small Molecule' },
          { value: 'all', label: 'All Approaches' }
        ],
        basketballAnalogy: 'Type of strategy to develop',
        biotechEquivalent: 'Therapeutic modality to pursue'
      }
    ],
    steps: [
      {
        id: 'disease-characterization',
        name: 'Disease Characterization',
        description: 'Comprehensive disease profile creation',
        basketballAnalogy: 'Understanding the opponent completely',
        biotechTranslation: 'NLP extraction of disease mechanisms'
      },
      {
        id: 'target-identification',
        name: 'Target Identification',
        description: 'Identify druggable targets',
        basketballAnalogy: 'Finding exploitable weaknesses',
        biotechTranslation: 'Pathway and protein target mapping'
      },
      {
        id: 'repurposing-screen',
        name: 'Drug Repurposing Screen',
        description: 'Screen approved drugs for activity',
        basketballAnalogy: 'Testing existing plays in new situations',
        biotechTranslation: 'In silico screening of approved compounds'
      },
      {
        id: 'mechanism-validation',
        name: 'Mechanism Validation',
        description: 'Validate predicted mechanisms',
        basketballAnalogy: 'Confirming the strategy works',
        biotechTranslation: 'Computational mechanism validation'
      },
      {
        id: 'patient-matching',
        name: 'Patient Matching',
        description: 'Identify patients for clinical trials',
        basketballAnalogy: 'Finding the right players for the system',
        biotechTranslation: 'Patient registry and genotype matching'
      },
      {
        id: 'trial-design',
        name: 'Adaptive Trial Design',
        description: 'Design efficient rare disease trial',
        basketballAnalogy: 'Efficient game planning with limited resources',
        biotechTranslation: 'N-of-1 or basket trial design'
      }
    ]
  },

  {
    id: 'rare-variant-interpreter',
    name: 'Rare Genetic Variant Interpreter',
    category: 'rare-disease',
    description: 'Interpret variants of uncertain significance (VUS) in rare disease patients using AI-powered structural prediction and functional consequence modeling.',
    basketballContext: 'Like evaluating unknown players to find hidden talent, this pipeline interprets mysterious genetic variants to uncover their role in disease.',
    biotechApplication: 'Combine structural biology, population genetics, and functional prediction to classify VUS and identify causal variants in undiagnosed patients.',
    estimatedDuration: '30-55 minutes',
    difficulty: 'intermediate',
    parameters: [
      {
        id: 'geneList',
        name: 'geneList',
        label: 'Gene List (comma-separated)',
        type: 'string',
        defaultValue: 'CFTR,BRCA1,TP53',
        basketballAnalogy: 'Positions to evaluate',
        biotechEquivalent: 'Genes to analyze'
      },
      {
        id: 'inheritanceMode',
        name: 'inheritanceMode',
        label: 'Inheritance Mode',
        type: 'select',
        defaultValue: 'any',
        options: [
          { value: 'dominant', label: 'Autosomal Dominant' },
          { value: 'recessive', label: 'Autosomal Recessive' },
          { value: 'x-linked', label: 'X-Linked' },
          { value: 'any', label: 'Any Mode' }
        ],
        basketballAnalogy: 'Play style inherited from team',
        biotechEquivalent: 'Expected inheritance pattern'
      }
    ],
    steps: [
      {
        id: 'variant-loading',
        name: 'Load Patient Variants',
        description: 'Import VCF and clinical data',
        basketballAnalogy: 'Loading player statistics',
        biotechTranslation: 'VCF parsing and annotation'
      },
      {
        id: 'frequency-filtering',
        name: 'Population Frequency Filtering',
        description: 'Filter by rarity in populations',
        basketballAnalogy: 'Identifying unique skills',
        biotechTranslation: 'gnomAD frequency filtering'
      },
      {
        id: 'structure-prediction',
        name: 'Structure Prediction',
        description: 'Predict protein structure impact',
        basketballAnalogy: 'Analyzing physical capabilities',
        biotechTranslation: 'AlphaFold2 + variant effect prediction'
      },
      {
        id: 'functional-prediction',
        name: 'Functional Impact Prediction',
        description: 'Predict functional consequences',
        basketballAnalogy: 'Predicting on-court impact',
        biotechTranslation: 'CADD, REVEL, and ensemble predictions'
      },
      {
        id: 'phenotype-matching',
        name: 'Phenotype Matching',
        description: 'Match to patient symptoms',
        basketballAnalogy: 'Matching skills to team needs',
        biotechTranslation: 'HPO term matching and ranking'
      },
      {
        id: 'report-generation',
        name: 'Clinical Report Generation',
        description: 'Generate clinical interpretation report',
        basketballAnalogy: 'Drafting the scouting report',
        biotechTranslation: 'ACMG classification and recommendations'
      }
    ]
  }
];

// Combine all templates
export const allPipelineTemplates = [...medicalPipelineTemplates];

// Helper functions
export const getMedicalTemplatesByCategory = (category: ExperimentCategory): PipelineTemplate[] => {
  return medicalPipelineTemplates.filter(t => t.category === category);
};

export const getMedicalTemplateById = (id: string): PipelineTemplate | undefined => {
  return medicalPipelineTemplates.find(t => t.id === id);
};

export const getBreakthroughPotential = (templateId: string): { 
  breakthrough: string; 
  impact: string; 
  timeline: string 
} => {
  const breakthroughs: Record<string, { breakthrough: string; impact: string; timeline: string }> = {
    'alzheimer-reversal': {
      breakthrough: 'First disease-modifying treatment that reverses cognitive decline',
      impact: '50 million patients worldwide could regain cognitive function',
      timeline: '5-10 years to clinic with accelerated development'
    },
    'cancer-immunotherapy': {
      breakthrough: 'CAR-T therapy for solid tumors with >80% response rate',
      impact: 'Potential cure for currently untreatable solid tumors',
      timeline: '3-7 years for first approvals'
    },
    'universal-vaccine': {
      breakthrough: 'Universal vaccine protecting against all variants',
      impact: 'End of pandemic threats from target virus family',
      timeline: '2-5 years for broad clinical availability'
    },
    'antiviral-discovery': {
      breakthrough: 'Pandemic preparedness through broad-spectrum antivirals',
      impact: 'Rapid response to any emerging viral threat',
      timeline: '3-5 years for first broad-spectrum approvals'
    },
    'crispr-cure-design': {
      breakthrough: 'One-time cure for genetic diseases',
      impact: 'Permanent cure instead of lifelong treatment',
      timeline: '1-3 years for several diseases already in trials'
    },
    'gene-therapy-manufacturing': {
      breakthrough: '10-100x reduction in gene therapy costs',
      impact: 'Making cures accessible to all patients regardless of income',
      timeline: '2-4 years for major cost reductions'
    },
    'digital-twin-therapy': {
      breakthrough: 'True personalized medicine with predicted outcomes',
      impact: 'Elimination of trial-and-error in treatment selection',
      timeline: '3-5 years for clinical implementation'
    },
    'organ-regeneration': {
      breakthrough: 'Lab-grown organs eliminating transplant waiting lists',
      impact: 'No more deaths while waiting for organ transplants',
      timeline: '5-15 years depending on organ complexity'
    },
    'parkinsons-reversal': {
      breakthrough: 'First treatment to reverse Parkinson\'s progression',
      impact: '10 million patients could regain motor function',
      timeline: '5-8 years for comprehensive therapy'
    },
    'rare-disease-nlp': {
      breakthrough: 'Treatments for hundreds of currently untreatable rare diseases',
      impact: 'Hope for millions of rare disease patients',
      timeline: '2-5 years per disease with streamlined approach'
    },
    'rare-variant-interpreter': {
      breakthrough: 'Ending diagnostic odyssey for rare disease patients',
      impact: 'Diagnosis for undiagnosed patients enabling treatment',
      timeline: 'Available now with continuous improvement'
    }
  };
  
  return breakthroughs[templateId] || {
    breakthrough: 'Novel therapeutic approach with significant patient impact',
    impact: 'Potential to transform treatment paradigm',
    timeline: '5-10 years for full clinical implementation'
  };
};
