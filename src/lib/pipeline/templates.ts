// Experiment Templates - Basketball-to-Biotech Pipeline Definitions
import { PipelineTemplate, ExperimentCategory } from './types';

export const experimentCategories: { id: ExperimentCategory; name: string; description: string; icon: string }[] = [
  {
    id: 'drug-discovery',
    name: 'Drug Discovery',
    description: 'Screen and optimize drug candidates using team efficiency metrics',
    icon: 'Pill'
  },
  {
    id: 'clinical-trial',
    name: 'Clinical Trial Design',
    description: 'Design trials using game strategy and player performance analogies',
    icon: 'ClipboardList'
  },
  {
    id: 'genomics',
    name: 'Genomics Analysis',
    description: 'Analyze genetic data using team roster and lineup concepts',
    icon: 'Dna'
  },
  {
    id: 'protein-engineering',
    name: 'Protein Engineering',
    description: 'Engineer proteins using shooting form and technique optimization',
    icon: 'Atom'
  },
  {
    id: 'pharmacokinetics',
    name: 'Pharmacokinetics',
    description: 'Model drug dynamics using player stamina and game clock metrics',
    icon: 'Activity'
  },
  {
    id: 'bioinformatics',
    name: 'Bioinformatics',
    description: 'Process biological data using team statistics and game analysis',
    icon: 'Database'
  },
  {
    id: 'biomarker-analysis',
    name: 'Biomarker Analysis',
    description: 'Identify biomarkers using clutch performance and consistency metrics',
    icon: 'Target'
  }
];

export const pipelineTemplates: PipelineTemplate[] = [
  // Drug Discovery Templates
  {
    id: 'drug-screening-fg',
    name: 'High-Throughput Drug Screening',
    category: 'drug-discovery',
    description: 'Screen compound libraries by translating field goal efficiency into drug-target binding rates. This pipeline processes large compound libraries and identifies potential drug candidates by mapping shooting accuracy to molecular binding efficiency.',
    basketballContext: 'Just as FG% measures successful shots out of attempts, drug screening measures successful compound-target interactions out of total compounds tested.',
    biotechApplication: 'High-throughput screening of compound libraries against biological targets to identify lead candidates for drug development.',
    estimatedDuration: '15-30 minutes',
    difficulty: 'intermediate',
    parameters: [
      {
        id: 'compoundCount',
        name: 'compoundCount',
        label: 'Compound Library Size',
        type: 'number',
        defaultValue: 10000,
        min: 100,
        max: 100000,
        basketballAnalogy: 'Total shot attempts (FGA)',
        biotechEquivalent: 'Number of compounds screened'
      },
      {
        id: 'targetType',
        name: 'targetType',
        label: 'Target Type',
        type: 'select',
        defaultValue: 'protein',
        options: [
          { value: 'protein', label: 'Protein Target' },
          { value: 'enzyme', label: 'Enzyme Target' },
          { value: 'receptor', label: 'Receptor Target' },
          { value: 'ion-channel', label: 'Ion Channel' }
        ],
        basketballAnalogy: 'Type of shot (2pt vs 3pt)',
        biotechEquivalent: 'Type of biological target'
      },
      {
        id: 'efficiencyThreshold',
        name: 'efficiencyThreshold',
        label: 'Hit Threshold (%)',
        type: 'number',
        defaultValue: 45,
        min: 20,
        max: 80,
        basketballAnalogy: 'Minimum FG% for good shooter',
        biotechEquivalent: 'Minimum binding efficiency for hit'
      }
    ],
    steps: [
      {
        id: 'load-data',
        name: 'Load Compound Data',
        description: 'Import compound library and target structure',
        basketballAnalogy: 'Setting up the court and warming up',
        biotechTranslation: 'Loading molecular structures into screening environment'
      },
      {
        id: 'preprocessing',
        name: 'Data Preprocessing',
        description: 'Normalize molecular descriptors and filter invalid compounds',
        basketballAnalogy: 'Scouting report analysis',
        biotechTranslation: 'Standardizing compound representations'
      },
      {
        id: 'docking',
        name: 'Molecular Docking',
        description: 'Perform virtual docking simulations',
        basketballAnalogy: 'Taking shots in practice',
        biotechTranslation: 'Simulating compound-target interactions'
      },
      {
        id: 'scoring',
        name: 'Binding Affinity Scoring',
        description: 'Calculate binding scores for each compound',
        basketballAnalogy: 'Calculating shooting percentages',
        biotechTranslation: 'Computing affinity metrics'
      },
      {
        id: 'ranking',
        name: 'Hit Identification',
        description: 'Rank compounds and identify top candidates',
        basketballAnalogy: 'Selecting the all-star team',
        biotechTranslation: 'Prioritizing lead compounds'
      },
      {
        id: 'validation',
        name: 'Cross-Validation',
        description: 'Validate hits against known actives',
        basketballAnalogy: 'Playoff performance check',
        biotechTranslation: 'Confirming screening results'
      }
    ]
  },

  // Clinical Trial Design
  {
    id: 'clinical-trial-design',
    name: 'Adaptive Trial Design',
    category: 'clinical-trial',
    description: 'Design adaptive clinical trials using game strategy principles. Translate coaching decisions and in-game adjustments into trial adaptation rules for optimal patient outcomes.',
    basketballContext: 'Just as coaches adjust strategy based on game flow, adaptive trials modify protocols based on interim results.',
    biotechApplication: 'Design efficient clinical trials that can adapt based on accumulating data while maintaining statistical validity.',
    estimatedDuration: '20-40 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'sampleSize',
        name: 'sampleSize',
        label: 'Initial Sample Size',
        type: 'number',
        defaultValue: 500,
        min: 50,
        max: 5000,
        basketballAnalogy: 'Team roster size',
        biotechEquivalent: 'Number of trial participants'
      },
      {
        id: 'adaptationType',
        name: 'adaptationType',
        label: 'Adaptation Strategy',
        type: 'select',
        defaultValue: 'group-sequential',
        options: [
          { value: 'group-sequential', label: 'Group Sequential' },
          { value: 'bayesian', label: 'Bayesian Adaptive' },
          { value: 'enrichment', label: 'Enrichment Design' },
          { value: 'drop-losers', label: 'Drop Losers Design' }
        ],
        basketballAnalogy: 'Offensive scheme (motion vs set plays)',
        biotechEquivalent: 'Trial adaptation methodology'
      },
      {
        id: 'interimAnalysis',
        name: 'interimAnalysis',
        label: 'Interim Analyses Count',
        type: 'number',
        defaultValue: 2,
        min: 0,
        max: 5,
        basketballAnalogy: 'Halftime adjustments',
        biotechEquivalent: 'Number of interim looks'
      },
      {
        id: 'alpha',
        name: 'alpha',
        label: 'Significance Level (α)',
        type: 'number',
        defaultValue: 0.05,
        min: 0.01,
        max: 0.1,
        basketballAnalogy: 'Clutch gene threshold',
        biotechEquivalent: 'Type I error rate'
      }
    ],
    steps: [
      {
        id: 'define-endpoints',
        name: 'Define Primary Endpoints',
        description: 'Establish primary and secondary outcomes',
        basketballAnalogy: 'Setting season goals',
        biotechTranslation: 'Defining trial objectives'
      },
      {
        id: 'power-analysis',
        name: 'Statistical Power Analysis',
        description: 'Calculate required sample size and power',
        basketballAnalogy: 'Team strength assessment',
        biotechTranslation: 'Determining trial sensitivity'
      },
      {
        id: 'randomization',
        name: 'Design Randomization',
        description: 'Create randomization and stratification scheme',
        basketballAnalogy: 'Draft lottery and team assignment',
        biotechTranslation: 'Ensuring unbiased allocation'
      },
      {
        id: 'adaptation-rules',
        name: 'Define Adaptation Rules',
        description: 'Establish decision criteria for adaptations',
        basketballAnalogy: 'Play-calling based on score',
        biotechTranslation: 'Creating adaptation triggers'
      },
      {
        id: 'simulation',
        name: 'Trial Simulation',
        description: 'Run Monte Carlo simulations to validate design',
        basketballAnalogy: 'Preseason games',
        biotechTranslation: 'Testing trial performance'
      },
      {
        id: 'report',
        name: 'Generate Protocol',
        description: 'Create trial protocol document',
        basketballAnalogy: 'Season playbook',
        biotechTranslation: 'Finalizing trial documentation'
      }
    ]
  },

  // Genomics Analysis
  {
    id: 'genomics-variant-analysis',
    name: 'Variant Effect Analysis',
    category: 'genomics',
    description: 'Analyze genetic variants using team roster and lineup optimization principles. Translate player combinations into gene interaction networks.',
    basketballContext: 'Just as starting lineups affect team performance, genetic variants influence biological pathways in complex ways.',
    biotechApplication: 'Identify and characterize genetic variants that impact disease risk and drug response.',
    estimatedDuration: '25-45 minutes',
    difficulty: 'intermediate',
    parameters: [
      {
        id: 'genomeBuild',
        name: 'genomeBuild',
        label: 'Genome Build',
        type: 'select',
        defaultValue: 'GRCh38',
        options: [
          { value: 'GRCh38', label: 'GRCh38 (hg38)' },
          { value: 'GRCh37', label: 'GRCh37 (hg19)' }
        ],
        basketballAnalogy: 'Court dimensions (standard vs international)',
        biotechEquivalent: 'Reference genome version'
      },
      {
        id: 'mafThreshold',
        name: 'mafThreshold',
        label: 'MAF Threshold',
        type: 'number',
        defaultValue: 0.01,
        min: 0.001,
        max: 0.5,
        basketballAnalogy: 'Bench player usage rate',
        biotechEquivalent: 'Minor allele frequency cutoff'
      },
      {
        id: 'impactFilter',
        name: 'impactFilter',
        label: 'Impact Filter',
        type: 'select',
        defaultValue: 'moderate',
        options: [
          { value: 'high', label: 'High Impact Only' },
          { value: 'moderate', label: 'Moderate+' },
          { value: 'all', label: 'All Variants' }
        ],
        basketballAnalogy: 'Starter vs role player impact',
        biotechEquivalent: 'Variant consequence severity'
      }
    ],
    steps: [
      {
        id: 'load-vcf',
        name: 'Load VCF Data',
        description: 'Import variant call format files',
        basketballAnalogy: 'Loading team roster',
        biotechTranslation: 'Importing genetic variant data'
      },
      {
        id: 'annotation',
        name: 'Variant Annotation',
        description: 'Annotate variants with functional predictions',
        basketballAnalogy: 'Player scouting reports',
        biotechTranslation: 'Adding functional context'
      },
      {
        id: 'filtering',
        name: 'Quality Filtering',
        description: 'Filter variants by quality and frequency',
        basketballAnalogy: 'Draft eligibility requirements',
        biotechTranslation: 'Ensuring data quality'
      },
      {
        id: 'pathway-analysis',
        name: 'Pathway Enrichment',
        description: 'Identify enriched biological pathways',
        basketballAnalogy: 'Team chemistry analysis',
        biotechTranslation: 'Finding biological patterns'
      },
      {
        id: 'prioritization',
        name: 'Variant Prioritization',
        description: 'Rank variants by clinical relevance',
        basketballAnalogy: 'MVP voting',
        biotechTranslation: 'Identifying key variants'
      }
    ]
  },

  // Protein Engineering
  {
    id: 'protein-stability',
    name: 'Protein Stability Engineering',
    category: 'protein-engineering',
    description: 'Engineer protein stability using shooting form optimization principles. Translate free throw consistency into protein folding stability.',
    basketballContext: 'Just as free throw consistency comes from repeatable form, protein stability comes from consistent folding patterns.',
    biotechApplication: 'Design stable protein variants for therapeutic and industrial applications.',
    estimatedDuration: '30-60 minutes',
    difficulty: 'advanced',
    parameters: [
      {
        id: 'targetTemp',
        name: 'targetTemp',
        label: 'Target Temperature (°C)',
        type: 'number',
        defaultValue: 37,
        min: 4,
        max: 80,
        basketballAnalogy: 'Game temperature conditions',
        biotechEquivalent: 'Operating temperature'
      },
      {
        id: 'mutationStrategy',
        name: 'mutationStrategy',
        label: 'Mutation Strategy',
        type: 'select',
        defaultValue: 'saturation',
        options: [
          { value: 'saturation', label: 'Saturation Mutagenesis' },
          { value: 'focused', label: 'Focused Libraries' },
          { value: ' computational', label: 'Computational Design' }
        ],
        basketballAnalogy: 'Shooting drill type',
        biotechEquivalent: 'Mutation approach'
      },
      {
        id: 'stabilityGoal',
        name: 'stabilityGoal',
        label: 'Stability Improvement (°C)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        max: 30,
        basketballAnalogy: 'FG% improvement target',
        biotechEquivalent: 'Tm increase target'
      }
    ],
    steps: [
      {
        id: 'structure-analysis',
        name: 'Structure Analysis',
        description: 'Analyze protein structure for stability determinants',
        basketballAnalogy: 'Analyzing shooting form',
        biotechTranslation: 'Identifying stability hotspots'
      },
      {
        id: 'mutation-design',
        name: 'Mutation Design',
        description: 'Design stabilizing mutations',
        basketballAnalogy: 'Form correction recommendations',
        biotechTranslation: 'Creating variant libraries'
      },
      {
        id: 'in-silico-screening',
        name: 'In Silico Screening',
        description: 'Screen mutations computationally',
        basketballAnalogy: 'Practice shots',
        biotechTranslation: 'Predicting stability effects'
      },
      {
        id: 'folding-simulation',
        name: 'Folding Simulation',
        description: 'Simulate protein folding dynamics',
        basketballAnalogy: 'Shot trajectory simulation',
        biotechTranslation: 'Molecular dynamics analysis'
      },
      {
        id: 'aggregation-check',
        name: 'Aggregation Assessment',
        description: 'Check for aggregation propensity',
        basketballAnalogy: 'Consistency under pressure',
        biotechTranslation: 'Predicting formulation behavior'
      }
    ]
  },

  // Pharmacokinetics
  {
    id: 'pk-modeling',
    name: 'Pharmacokinetic Modeling',
    category: 'pharmacokinetics',
    description: 'Model drug pharmacokinetics using player stamina and game clock metrics. Translate player fatigue curves into drug concentration-time profiles.',
    basketballContext: 'Just as player performance varies with minutes played, drug concentration varies over time in the body.',
    biotechApplication: 'Predict drug behavior in the body to optimize dosing regimens.',
    estimatedDuration: '15-25 minutes',
    difficulty: 'beginner',
    parameters: [
      {
        id: 'modelType',
        name: 'modelType',
        label: 'PK Model Type',
        type: 'select',
        defaultValue: 'two-compartment',
        options: [
          { value: 'one-compartment', label: 'One Compartment' },
          { value: 'two-compartment', label: 'Two Compartment' },
          { value: 'three-compartment', label: 'Three Compartment' }
        ],
        basketballAnalogy: 'Simple vs complex offensive sets',
        biotechEquivalent: 'Compartmental model complexity'
      },
      {
        id: 'dosingRoute',
        name: 'dosingRoute',
        label: 'Administration Route',
        type: 'select',
        defaultValue: 'iv',
        options: [
          { value: 'iv', label: 'Intravenous' },
          { value: 'oral', label: 'Oral' },
          { value: 'sc', label: 'Subcutaneous' }
        ],
        basketballAnalogy: 'Shot type (layup vs jump shot)',
        biotechEquivalent: 'Drug delivery method'
      },
      {
        id: 'doseAmount',
        name: 'doseAmount',
        label: 'Dose Amount (mg)',
        type: 'number',
        defaultValue: 100,
        min: 1,
        max: 10000,
        basketballAnalogy: 'Shot difficulty',
        biotechEquivalent: 'Drug quantity administered'
      }
    ],
    steps: [
      {
        id: 'param-estimation',
        name: 'Parameter Estimation',
        description: 'Estimate PK parameters from data',
        basketballAnalogy: 'Player efficiency rating calculation',
        biotechTranslation: 'Determining clearance and volume'
      },
      {
        id: 'model-fitting',
        name: 'Model Fitting',
        description: 'Fit PK model to concentration data',
        basketballAnalogy: 'Fitting shot arc to basket',
        biotechTranslation: 'Optimizing model parameters'
      },
      {
        id: 'simulation',
        name: 'Concentration Simulation',
        description: 'Simulate concentration-time profiles',
        basketballAnalogy: 'Predicting player stamina curve',
        biotechTranslation: 'Predicting drug levels over time'
      },
      {
        id: 'dosing-optimization',
        name: 'Dosing Optimization',
        description: 'Optimize dosing regimen',
        basketballAnalogy: 'Managing player rotations',
        biotechTranslation: 'Finding optimal dose schedule'
      },
      {
        id: 'report',
        name: 'Generate PK Report',
        description: 'Create comprehensive PK analysis report',
        basketballAnalogy: 'Game summary statistics',
        biotechTranslation: 'Documenting PK findings'
      }
    ]
  },

  // Bioinformatics
  {
    id: 'rna-seq-analysis',
    name: 'RNA-Seq Differential Expression',
    category: 'bioinformatics',
    description: 'Analyze gene expression data using team statistics and game analysis approaches. Translate player performance comparisons into gene expression differences.',
    basketballContext: 'Just as we compare player stats across games, we compare gene expression across conditions.',
    biotechApplication: 'Identify differentially expressed genes between experimental conditions.',
    estimatedDuration: '20-35 minutes',
    difficulty: 'intermediate',
    parameters: [
      {
        id: 'comparisonType',
        name: 'comparisonType',
        label: 'Comparison Type',
        type: 'select',
        defaultValue: 'treatment-control',
        options: [
          { value: 'treatment-control', label: 'Treatment vs Control' },
          { value: 'time-course', label: 'Time Course' },
          { value: 'multi-group', label: 'Multi-Group' }
        ],
        basketballAnalogy: 'Home vs away game comparison',
        biotechEquivalent: 'Experimental comparison design'
      },
      {
        id: 'foldChangeCutoff',
        name: 'foldChangeCutoff',
        label: 'Fold Change Cutoff',
        type: 'number',
        defaultValue: 2,
        min: 1.5,
        max: 10,
        basketballAnalogy: 'Point differential threshold',
        biotechEquivalent: 'Minimum expression change'
      },
      {
        id: 'fdrThreshold',
        name: 'fdrThreshold',
        label: 'FDR Threshold',
        type: 'number',
        defaultValue: 0.05,
        min: 0.01,
        max: 0.2,
        basketballAnalogy: 'Confidence in statistical significance',
        biotechEquivalent: 'False discovery rate control'
      }
    ],
    steps: [
      {
        id: 'qc',
        name: 'Quality Control',
        description: 'Assess data quality and filter samples',
        basketballAnalogy: 'Pre-game warmup assessment',
        biotechTranslation: 'Ensuring data integrity'
      },
      {
        id: 'normalization',
        name: 'Data Normalization',
        description: 'Normalize expression values',
        basketballAnalogy: 'Adjusting for pace of play',
        biotechTranslation: 'Making samples comparable'
      },
      {
        id: 'differential-expression',
        name: 'Differential Expression Analysis',
        description: 'Identify differentially expressed genes',
        basketballAnalogy: 'Finding stat leaders',
        biotechTranslation: 'Finding significant genes'
      },
      {
        id: 'enrichment',
        name: 'Gene Set Enrichment',
        description: 'Perform pathway and GO enrichment',
        basketballAnalogy: 'Team performance trends',
        biotechTranslation: 'Understanding biological context'
      },
      {
        id: 'visualization',
        name: 'Create Visualizations',
        description: 'Generate plots and figures',
        basketballAnalogy: 'Highlight reels',
        biotechTranslation: 'Creating publication figures'
      }
    ]
  },

  // Biomarker Analysis
  {
    id: 'biomarker-discovery',
    name: 'Biomarker Discovery Pipeline',
    category: 'biomarker-analysis',
    description: 'Identify biomarkers using clutch performance and consistency metrics. Translate player reliability into biomarker diagnostic accuracy.',
    basketballContext: 'Just as clutch players deliver in key moments, good biomarkers accurately indicate disease state.',
    biotechApplication: 'Discover and validate biomarkers for disease diagnosis and treatment monitoring.',
    estimatedDuration: '25-40 minutes',
    difficulty: 'intermediate',
    parameters: [
      {
        id: 'biomarkerType',
        name: 'biomarkerType',
        label: 'Biomarker Type',
        type: 'select',
        defaultValue: 'diagnostic',
        options: [
          { value: 'diagnostic', label: 'Diagnostic' },
          { value: 'prognostic', label: 'Prognostic' },
          { value: 'predictive', label: 'Predictive' }
        ],
        basketballAnalogy: 'Role player type (starter, sixth man, specialist)',
        biotechEquivalent: 'Biomarker clinical use'
      },
      {
        id: 'aucThreshold',
        name: 'aucThreshold',
        label: 'Minimum AUC',
        type: 'number',
        defaultValue: 0.75,
        min: 0.5,
        max: 1.0,
        basketballAnalogy: 'Minimum clutch rating',
        biotechEquivalent: 'Discrimination threshold'
      },
      {
        id: 'validationMethod',
        name: 'validationMethod',
        label: 'Validation Approach',
        type: 'select',
        defaultValue: 'cross-validation',
        options: [
          { value: 'cross-validation', label: 'Cross-Validation' },
          { value: 'train-test', label: 'Train/Test Split' },
          { value: 'external', label: 'External Validation' }
        ],
        basketballAnalogy: 'Regular season vs playoff validation',
        biotechEquivalent: 'Validation methodology'
      }
    ],
    steps: [
      {
        id: 'feature-selection',
        name: 'Feature Selection',
        description: 'Select candidate biomarker features',
        basketballAnalogy: 'Scouting potential players',
        biotechTranslation: 'Identifying candidate markers'
      },
      {
        id: 'model-training',
        name: 'Model Training',
        description: 'Train classification models',
        basketballAnalogy: 'Player development program',
        biotechTranslation: 'Building predictive model'
      },
      {
        id: 'evaluation',
        name: 'Model Evaluation',
        description: 'Evaluate model performance',
        basketballAnalogy: 'Player performance review',
        biotechTranslation: 'Assessing diagnostic accuracy'
      },
      {
        id: 'validation',
        name: 'Biomarker Validation',
        description: 'Validate biomarker panel',
        basketballAnalogy: 'Playoff performance check',
        biotechTranslation: 'Confirming predictive value'
      },
      {
        id: 'reporting',
        name: 'Generate Report',
        description: 'Create biomarker report',
        basketballAnalogy: 'End of season summary',
        biotechTranslation: 'Documenting findings'
      }
    ]
  }
];

export const getTemplatesByCategory = (category: ExperimentCategory): PipelineTemplate[] => {
  return pipelineTemplates.filter(t => t.category === category);
};

export const getTemplateById = (id: string): PipelineTemplate | undefined => {
  return pipelineTemplates.find(t => t.id === id);
};
