'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Play, Square, RefreshCw, Plus, Trash2, ChevronUp, ChevronDown,
  Check, X, Circle, Download, Upload, FileCode, Markdown
} from 'lucide-react';

interface NotebookPanelProps {
  theme: string;
}

interface Cell {
  id: string;
  type: 'code' | 'markdown' | 'raw';
  content: string;
  output?: string;
  status: 'idle' | 'running' | 'success' | 'error';
  executionCount?: number;
}

const defaultCells: Cell[] = [
  {
    id: '1',
    type: 'markdown',
    content: `# Basketball-to-Biotech Analysis

This notebook demonstrates the translation of NBA statistics into biotech research concepts.

## Overview
- **Data Source**: NBA regular season stats 2010-2024
- **Translation**: Basketball metrics → Biotech analogies
- **Goal**: Enable sports-driven biotech research`,
    status: 'success',
    executionCount: 1
  },
  {
    id: '2',
    type: 'code',
    content: `import pandas as pd
import numpy as np
from scipy import stats

# Load NBA data
df = pd.read_csv('/data/nba/regular_season_totals.csv')
print(f"Loaded {len(df)} games from {df['SEASON_YEAR'].nunique()} seasons")
print(f"Teams: {df['TEAM_NAME'].nunique()}")`,
    output: `Loaded 24847 games from 14 seasons
Teams: 30`,
    status: 'success',
    executionCount: 2
  },
  {
    id: '3',
    type: 'code',
    content: `# Biotech Translation: FG% → Transfection Efficiency
def translate_to_biotech(df):
    """Convert basketball stats to biotech concepts."""
    results = df.groupby('TEAM_NAME').agg({
        'FG_PCT': 'mean',      # Transfection Efficiency
        'FG3_PCT': 'mean',     # Specificity Ratio
        'AST': 'mean',         # Synergy Index
        'TOV': 'mean',         # Adverse Events
        'PTS': 'mean',         # Bioavailability
        'PLUS_MINUS': 'mean'   # Therapeutic Index
    }).round(3)
    
    results.columns = [
        'Transfection_Efficiency',
        'Specificity_Ratio',
        'Synergy_Index',
        'Adverse_Events',
        'Bioavailability',
        'Therapeutic_Index'
    ]
    return results.sort_values('Transfection_Efficiency', ascending=False)

biotech_df = translate_to_biotech(df)
biotech_df.head(10)`,
    output: `                    Transfection_Efficiency  Specificity_Ratio  ...
TEAM_NAME                                                    
Golden State Warriors                0.478              0.385  ...
Boston Celtics                       0.472              0.379  ...
Phoenix Suns                         0.469              0.372  ...
Denver Nuggets                       0.465              0.368  ...
Oklahoma City Thunder                0.461              0.365  ...`,
    status: 'success',
    executionCount: 3
  },
  {
    id: '4',
    type: 'code',
    content: `# Statistical analysis: Correlation matrix
import seaborn as sns
import matplotlib.pyplot as plt

corr_matrix = biotech_df.corr()
plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap='viridis', center=0)
plt.title('Biotech Analogy Correlation Matrix')
plt.tight_layout()
plt.savefig('correlation_matrix.png', dpi=150)
plt.show()
print("Correlation matrix saved!")`,
    output: `[<Figure size 1000x800 with 2 Axes>]
Correlation matrix saved!`,
    status: 'success',
    executionCount: 4
  }
];

export default function NotebookPanel({ theme }: NotebookPanelProps) {
  const [cells, setCells] = useState<Cell[]>(defaultCells);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [kernelStatus, setKernelStatus] = useState<'idle' | 'busy' | 'disconnected'>('idle');

  const runCell = (cellId: string) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, status: 'running' as const }
        : cell
    ));
    setKernelStatus('busy');
    
    // Simulate execution
    setTimeout(() => {
      setCells(prev => prev.map(cell => 
        cell.id === cellId 
          ? { ...cell, status: 'success' as const }
          : cell
      ));
      setKernelStatus('idle');
    }, 1000);
  };

  const runAllCells = () => {
    setKernelStatus('busy');
    cells.forEach((cell, index) => {
      if (cell.type === 'code') {
        setTimeout(() => runCell(cell.id), index * 500);
      }
    });
  };

  const addCell = (type: 'code' | 'markdown' | 'raw', afterId?: string) => {
    const newCell: Cell = {
      id: Date.now().toString(),
      type,
      content: type === 'code' ? '# New cell\n' : type === 'markdown' ? '## New Section\n' : '',
      status: 'idle'
    };
    
    if (afterId) {
      const index = cells.findIndex(c => c.id === afterId);
      const newCells = [...cells];
      newCells.splice(index + 1, 0, newCell);
      setCells(newCells);
    } else {
      setCells([...cells, newCell]);
    }
  };

  const deleteCell = (cellId: string) => {
    setCells(prev => prev.filter(c => c.id !== cellId));
  };

  const moveCell = (cellId: string, direction: 'up' | 'down') => {
    const index = cells.findIndex(c => c.id === cellId);
    if (direction === 'up' && index > 0) {
      const newCells = [...cells];
      [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
      setCells(newCells);
    } else if (direction === 'down' && index < cells.length - 1) {
      const newCells = [...cells];
      [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
      setCells(newCells);
    }
  };

  const getCellStatusIcon = (status: Cell['status']) => {
    switch (status) {
      case 'running': return <RefreshCw className="w-3 h-3 animate-spin text-yellow-500" />;
      case 'success': return <Check className="w-3 h-3 text-green-500" />;
      case 'error': return <X className="w-3 h-3 text-red-500" />;
      default: return <Circle className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7" onClick={runAllCells}>
            <Play className="w-4 h-4 text-green-500 mr-1" />
            Run All
          </Button>
          <Button variant="ghost" size="sm" className="h-7" onClick={() => addCell('code')}>
            <Plus className="w-4 h-4 mr-1" />
            Code
          </Button>
          <Button variant="ghost" size="sm" className="h-7" onClick={() => addCell('markdown')}>
            <Markdown className="w-4 h-4 mr-1" />
            Markdown
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Kernel:</span>
            <Badge variant="outline" className={`text-xs ${
              kernelStatus === 'idle' ? 'border-green-500 text-green-500' :
              kernelStatus === 'busy' ? 'border-yellow-500 text-yellow-500' :
              'border-red-500 text-red-500'
            }`}>
              {kernelStatus === 'idle' ? 'Python 3.11' : kernelStatus === 'busy' ? 'Busy' : 'Disconnected'}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-7">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Cells */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {cells.map((cell, index) => (
            <div
              key={cell.id}
              className={`border rounded-lg overflow-hidden ${
                selectedCell === cell.id 
                  ? theme === 'dark' ? 'border-blue-500' : 'border-blue-400'
                  : theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'
              }`}
              onClick={() => setSelectedCell(cell.id)}
            >
              {/* Cell Header */}
              <div className={`flex items-center justify-between px-2 py-1 ${
                theme === 'dark' ? 'bg-[#161b22]' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">[{cell.executionCount || ' '}]</span>
                  {getCellStatusIcon(cell.status)}
                  <Badge variant="outline" className="text-xs">
                    {cell.type === 'code' ? <FileCode className="w-3 h-3 mr-1" /> : 
                     cell.type === 'markdown' ? <Markdown className="w-3 h-3 mr-1" /> : null}
                    {cell.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {cell.type === 'code' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); runCell(cell.id); }}
                    >
                      <Play className="w-3 h-3 text-green-500" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={(e) => { e.stopPropagation(); moveCell(cell.id, 'up'); }}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={(e) => { e.stopPropagation(); moveCell(cell.id, 'down'); }}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={(e) => { e.stopPropagation(); deleteCell(cell.id); }}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
              
              {/* Cell Content */}
              <div className="p-2">
                {cell.type === 'markdown' ? (
                  <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                    <pre className="text-sm whitespace-pre-wrap font-mono">{cell.content}</pre>
                  </div>
                ) : (
                  <Textarea
                    value={cell.content}
                    onChange={(e) => setCells(prev => prev.map(c => 
                      c.id === cell.id ? { ...c, content: e.target.value } : c
                    ))}
                    className={`min-h-[80px] font-mono text-sm ${
                      theme === 'dark' ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-gray-200'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
              
              {/* Output */}
              {cell.output && (
                <div className={`border-t ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                  <div className={`px-2 py-1 text-xs ${theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gray-50'} text-gray-500`}>
                    Output
                  </div>
                  <pre className={`p-3 text-sm font-mono overflow-x-auto ${
                    theme === 'dark' ? 'bg-[#0d1117] text-green-400' : 'bg-gray-50 text-green-600'
                  }`}>
                    {cell.output}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
