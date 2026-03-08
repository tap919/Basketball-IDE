// Basketball to Biotech Translation Analogies
export interface BiotechAnalogy {
  basketballTerm: string;
  biotechEquivalent: string;
  description: string;
  formula?: string;
  significanceScore: number;
}

export const basketballBiotechAnalogies: BiotechAnalogy[] = [
  {
    basketballTerm: "Field Goal Percentage (FG%)",
    biotechEquivalent: "Transfection Efficiency",
    description: "Just as FG% measures successful shots out of attempts, transfection efficiency measures successful gene deliveries out of total attempts.",
    formula: "FG% = FGM / FGA ≈ Transfected Cells / Total Cells",
    significanceScore: 0.95
  },
  {
    basketballTerm: "Three-Point Percentage (3P%)",
    biotechEquivalent: "Specificity Ratio",
    description: "Like 3-pointers requiring more precision, specificity measures how precisely a drug hits its target vs off-target effects.",
    formula: "3P% = 3PM / 3PA ≈ Target Hits / (Target + Off-target Hits)",
    significanceScore: 0.88
  },
  {
    basketballTerm: "Assists (AST)",
    biotechEquivalent: "Synergistic Drug Interactions",
    description: "Assists represent plays that set up scoring; similarly, synergistic interactions enhance therapeutic outcomes.",
    formula: "AST Rate ≈ Synergy Index",
    significanceScore: 0.82
  },
  {
    basketballTerm: "Rebounds (REB)",
    biotechEquivalent: "Recapture Rate",
    description: "Rebounds recover missed shots; recapture rates measure how well biological systems recover or recycle molecules.",
    formula: "REB% ≈ Molecules Recycled / Total Molecules Lost",
    significanceScore: 0.75
  },
  {
    basketballTerm: "Turnovers (TOV)",
    biotechEquivalent: "Adverse Events",
    description: "Turnovers represent lost possessions; adverse events represent unintended negative outcomes in treatment.",
    formula: "TOV Rate ≈ Adverse Events / Treatment Duration",
    significanceScore: 0.92
  },
  {
    basketballTerm: "Plus/Minus (+/-)",
    biotechEquivalent: "Therapeutic Index",
    description: "Plus/minus measures net impact; therapeutic index measures the ratio of toxic dose to effective dose.",
    formula: "+/- ≈ log(Toxic Dose / Effective Dose)",
    significanceScore: 0.89
  },
  {
    basketballTerm: "Points Per Game (PPG)",
    biotechEquivalent: "Bioavailability",
    description: "PPG measures scoring output; bioavailability measures how much drug reaches systemic circulation.",
    formula: "PPG ≈ AUC (Area Under Curve) of Drug Concentration",
    significanceScore: 0.85
  },
  {
    basketballTerm: "Free Throw Percentage (FT%)",
    biotechEquivalent: "Baseline Efficacy",
    description: "Free throws are uncontested shots; baseline efficacy measures performance under controlled conditions.",
    formula: "FT% ≈ Response Rate in Control Arm",
    significanceScore: 0.78
  },
  {
    basketballTerm: "Blocks (BLK)",
    biotechEquivalent: "Inhibition Constants (Ki)",
    description: "Blocks prevent opponent scoring; inhibition constants measure how well a compound blocks a target.",
    formula: "BLK Rate ≈ 1 / Ki",
    significanceScore: 0.87
  },
  {
    basketballTerm: "Steals (STL)",
    biotechEquivalent: "Competitive Binding Affinity",
    description: "Steals take possession from opponents; competitive binding measures how well a drug displaces competitors.",
    formula: "STL Rate ≈ Competitive Displacement Index",
    significanceScore: 0.83
  },
  {
    basketballTerm: "Minutes Played (MIN)",
    biotechEquivalent: "Half-Life",
    description: "Minutes indicate duration of contribution; half-life indicates duration of drug presence.",
    formula: "MIN ≈ Half-life × Clearance Factor",
    significanceScore: 0.91
  },
  {
    basketballTerm: "Offensive Rebounds (OREB)",
    biotechEquivalent: "Reuptake Inhibition",
    description: "Offensive rebounds create new scoring chances; reuptake inhibition maintains higher neurotransmitter levels.",
    formula: "OREB Rate ≈ Reuptake Blockade %",
    significanceScore: 0.76
  }
];

export const getAnalogyForStat = (statKey: string): BiotechAnalogy | undefined => {
  const keyMap: Record<string, string> = {
    'FG_PCT': 'Field Goal Percentage (FG%)',
    'FG3_PCT': 'Three-Point Percentage (3P%)',
    'AST': 'Assists (AST)',
    'REB': 'Rebounds (REB)',
    'TOV': 'Turnovers (TOV)',
    'PLUS_MINUS': 'Plus/Minus (+/-)',
    'PTS': 'Points Per Game (PPG)',
    'FT_PCT': 'Free Throw Percentage (FT%)',
    'BLK': 'Blocks (BLK)',
    'STL': 'Steals (STL)',
    'MIN': 'Minutes Played (MIN)',
    'OREB': 'Offensive Rebounds (OREB)'
  };
  
  const searchTerm = keyMap[statKey];
  return basketballBiotechAnalogies.find(a => a.basketballTerm === searchTerm);
};

export const translateStatToBiotech = (statKey: string, value: number): {
  original: { stat: string; value: number };
  translated: { concept: string; equivalent: string; interpretation: string };
} => {
  const analogy = getAnalogyForStat(statKey);
  
  if (!analogy) {
    return {
      original: { stat: statKey, value },
      translated: { 
        concept: 'Unknown', 
        equivalent: 'No direct biotech equivalent', 
        interpretation: 'This statistic does not have a direct biotech analogy.' 
      }
    };
  }
  
  // Generate interpretation based on value
  let interpretation = '';
  const highThreshold = 0.7;
  const lowThreshold = 0.3;
  
  if (statKey.includes('PCT') || statKey.includes('_PCT')) {
    const normalizedValue = value / 100;
    if (normalizedValue > highThreshold) {
      interpretation = `High ${analogy.biotechEquivalent.toLowerCase()} indicates excellent therapeutic potential.`;
    } else if (normalizedValue < lowThreshold) {
      interpretation = `Low ${analogy.biotechEquivalent.toLowerCase()} suggests need for optimization.`;
    } else {
      interpretation = `Moderate ${analogy.biotechEquivalent.toLowerCase()} within acceptable clinical range.`;
    }
  } else {
    interpretation = `${analogy.biotechEquivalent} derived from ${analogy.basketballTerm}.`;
  }
  
  return {
    original: { stat: analogy.basketballTerm, value },
    translated: {
      concept: analogy.biotechEquivalent,
      equivalent: analogy.formula || 'See formula for calculation',
      interpretation
    }
  };
};
