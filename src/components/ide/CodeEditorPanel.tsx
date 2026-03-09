'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Code2, Play, Copy, Check, Download, Upload, Save,
  FileCode, Sparkles, Zap
} from 'lucide-react';

interface CodeEditorPanelProps {
  theme: string;
}

const SAMPLE_SCRIPTS = [
  {
    id: 'team-analysis',
    name: 'team-analysis.ts',
    language: 'typescript',
    code: `// Basketball-to-Biotech Team Analysis Script
import { translateStatToBiotech } from '@/lib/translation/analogies';

interface TeamStats {
  teamName: string;
  fg_pct: number;
  three_pct: number;
  assists: number;
  turnovers: number;
}

async function analyzeTeam(stats: TeamStats) {
  // Translate basketball stats to biotech concepts
  const fgTranslation = translateStatToBiotech('FG_PCT', stats.fg_pct);
  const tovTranslation = translateStatToBiotech('TOV', stats.turnovers);
  
  console.log(\`Team: \${stats.teamName}\`);
  console.log(\`Transfection Efficiency: \${fgTranslation.translated.concept}\`);
  console.log(\`Adverse Event Rate: \${tovTranslation.translated.concept}\`);
  
  return {
    team: stats.teamName,
    biotechProfile: {
      deliveryEfficiency: stats.fg_pct,
      specificityIndex: stats.three_pct,
      synergyScore: stats.assists / 10,
      riskProfile: stats.turnovers / 82
    }
  };
}

// Example usage
const celtics = {
  teamName: 'Boston Celtics',
  fg_pct: 0.475,
  three_pct: 0.385,
  assists: 26.9,
  turnovers: 12.1
};

analyzeTeam(celtics);`
  },
  {
    id: 'player-stats',
    name: 'player-stats.ts',
    language: 'typescript',
    code: `// Player Performance Analysis
interface PlayerGame {
  playerId: string;
  playerName: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
}

function calculateEfficiency(game: PlayerGame): number {
  // NBA Efficiency Formula
  // (PTS + REB + AST + STL + BLK - FGM - FTA - TOV) / GP
  const positive = game.points + game.rebounds + game.assists + game.steals + game.blocks;
  const negative = game.turnovers;
  return (positive - negative) / game.minutes;
}

function translateToBiotech(efficiency: number): string {
  if (efficiency > 0.8) return 'High Potency Compound';
  if (efficiency > 0.6) return 'Moderate Efficacy Drug';
  if (efficiency > 0.4) return 'Baseline Therapeutic';
  return 'Requires Optimization';
}

export { calculateEfficiency, translateToBiotech };`
  },
  {
    id: 'biotech-convert',
    name: 'biotech-convert.ts',
    language: 'typescript',
    code: `// Basketball-to-Biotech Conversion Utilities
export const BIOTECH_ANALOGIES = {
  // Shooting Metrics → Drug Delivery
  'FG_PCT': {
    biotech: 'Transfection Efficiency',
    formula: 'Successful Deliveries / Total Attempts',
    interpretation: (value: number) => 
      value > 0.5 ? 'Excellent delivery system' : 'Needs optimization'
  },
  'FG3_PCT': {
    biotech: 'Target Specificity',
    formula: 'On-target / Total Binding Events',
    interpretation: (value: number) =>
      value > 0.4 ? 'Highly selective' : 'Off-target concerns'
  },
  
  // Playmaking → Drug Interactions
  'AST': {
    biotech: 'Synergy Index',
    formula: 'Enhanced Outcomes / Independent Effects',
    interpretation: (value: number) =>
      value > 8 ? 'Strong synergistic profile' : 'Additive effects only'
  },
  
  // Defense → Safety Profile
  'BLK': {
    biotech: 'Inhibition Constant (Ki)',
    formula: 'IC50 / (1 + [Substrate]/Km)',
    interpretation: (value: number) =>
      value > 5 ? 'Potent inhibitor' : 'Moderate blockade'
  }
};

export function convertToBiotech(stat: keyof typeof BIOTECH_ANALOGIES, value: number) {
  const analogy = BIOTECH_ANALOGIES[stat];
  return {
    originalStat: stat,
    biotechEquivalent: analogy.biotech,
    formula: analogy.formula,
    interpretation: analogy.interpretation(value)
  };
}`
  }
];

export default function CodeEditorPanel({ theme }: CodeEditorPanelProps) {
  const [selectedScript, setSelectedScript] = useState(SAMPLE_SCRIPTS[0]);
  const [code, setCode] = useState(selectedScript.code);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleScriptSelect = (script: typeof SAMPLE_SCRIPTS[0]) => {
    setSelectedScript(script);
    setCode(script.code);
    setOutput([]);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput([]);
    
    // Simulate script execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setOutput([
      '> Compiling TypeScript...',
      '> Compilation successful.',
      '',
      '> Running analysis...',
      '',
      'Team: Boston Celtics',
      'Transfection Efficiency: 47.5%',
      'Biotech Profile Generated:',
      '  - Delivery Efficiency: 0.475',
      '  - Specificity Index: 0.385',
      '  - Synergy Score: 2.69',
      '  - Risk Profile: 0.148',
      '',
      '✓ Analysis complete. 1 result exported.'
    ]);
    
    setIsRunning(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedScript.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* File Tabs */}
      <div className={`flex items-center gap-1 px-2 py-1 border-b ${theme === 'dark' ? 'border-[#30363d] bg-[#161b22]' : 'border-gray-200 bg-gray-50'}`}>
        {SAMPLE_SCRIPTS.map(script => (
          <button
            key={script.id}
            onClick={() => handleScriptSelect(script)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-sm transition-colors ${
              selectedScript.id === script.id
                ? theme === 'dark' ? 'bg-[#0d1117] text-white border-t border-x border-[#30363d]' : 'bg-white text-gray-900 border-t border-x border-gray-200'
                : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#21262d]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            {script.name}
          </button>
        ))}
        
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={handleRun} disabled={isRunning}>
            {isRunning ? (
              <Zap className="w-4 h-4 animate-pulse text-yellow-500" />
            ) : (
              <Play className="w-4 h-4 text-green-500" />
            )}
            <span className="ml-1">Run</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 flex">
        {/* Code Panel */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4">
              <pre className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <code>{code}</code>
              </pre>
            </div>
          </ScrollArea>
        </div>
        
        {/* Output Panel */}
        <div className={`w-80 border-l ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'} flex flex-col`}>
          <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Output</span>
            </div>
            <Badge variant="outline" className="text-xs">
              TypeScript
            </Badge>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-3">
              {output.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8">
                  <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Run script to see output</p>
                </div>
              ) : (
                <pre className={`text-xs font-mono ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {output.join('\n')}
                </pre>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className={`flex items-center justify-between px-3 py-1 text-xs border-t ${theme === 'dark' ? 'border-[#30363d] bg-[#161b22] text-gray-500' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
        <div className="flex items-center gap-4">
          <span>TypeScript</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>{code.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  );
}
