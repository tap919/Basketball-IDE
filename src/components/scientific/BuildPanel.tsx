'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Play, Square, RefreshCw, Settings, FileText, Check, X,
  AlertCircle, Clock, Zap, Target, Layers
} from 'lucide-react';

interface BuildPanelProps {
  theme: string;
}

interface BuildTarget {
  id: string;
  name: string;
  status: 'idle' | 'building' | 'success' | 'failed';
  lastRun?: string;
  duration?: string;
}

interface BuildLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

const buildSystems = [
  { id: 'make', name: 'Make', description: 'Classic build automation' },
  { id: 'cmake', name: 'CMake', description: 'Cross-platform build system' },
  { id: 'snakemake', name: 'Snakemake', description: 'Workflow management' },
  { id: 'nextflow', name: 'Nextflow', description: 'Data-driven pipelines' },
  { id: 'custom', name: 'Custom Script', description: 'Your own build script' }
];

const sampleTargets: BuildTarget[] = [
  { id: '1', name: 'all', status: 'success', lastRun: '2 min ago', duration: '45s' },
  { id: '2', name: 'clean', status: 'idle' },
  { id: '3', name: 'data/process', status: 'success', lastRun: '2 min ago', duration: '12s' },
  { id: '4', name: 'analysis/correlation', status: 'success', lastRun: '2 min ago', duration: '8s' },
  { id: '5', name: 'plots/figures', status: 'failed', lastRun: '5 min ago', duration: '3s' },
  { id: '6', name: 'report', status: 'idle' }
];

const sampleDeps = [
  { from: 'data/process', to: 'analysis/correlation' },
  { from: 'data/process', to: 'analysis/regression' },
  { from: 'analysis/correlation', to: 'plots/figures' },
  { from: 'analysis/regression', to: 'plots/figures' },
  { from: 'plots/figures', to: 'report' }
];

export default function BuildPanel({ theme }: BuildPanelProps) {
  const [selectedSystem, setSelectedSystem] = useState('make');
  const [targets, setTargets] = useState<BuildTarget[]>(sampleTargets);
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [logs, setLogs] = useState<BuildLog[]>([
    { timestamp: '10:30:01', level: 'info', message: 'Starting build: all' },
    { timestamp: '10:30:01', level: 'info', message: 'Checking dependencies...' },
    { timestamp: '10:30:02', level: 'success', message: '✓ data/process (12.3s)' },
    { timestamp: '10:30:14', level: 'info', message: 'Running analysis/correlation...' },
    { timestamp: '10:30:22', level: 'success', message: '✓ analysis/correlation (8.1s)' },
    { timestamp: '10:30:30', level: 'warning', message: '⚠ plots/figures: matplotlib backend changed' },
    { timestamp: '10:30:45', level: 'success', message: 'Build complete: 3/3 targets (45.2s)' }
  ]);
  const [isBuilding, setIsBuilding] = useState(false);

  const runBuild = () => {
    setIsBuilding(true);
    setTargets(prev => prev.map(t => 
      t.name === selectedTarget ? { ...t, status: 'building' } : t
    ));
    
    setTimeout(() => {
      setIsBuilding(false);
      setTargets(prev => prev.map(t => 
        t.name === selectedTarget ? { ...t, status: 'success', lastRun: 'Just now', duration: '2s' } : t
      ));
    }, 2000);
  };

  const getLogColor = (level: BuildLog['level']) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
    }
  };

  const getStatusIcon = (status: BuildTarget['status']) => {
    switch (status) {
      case 'building': return <RefreshCw className="w-3 h-3 animate-spin text-yellow-500" />;
      case 'success': return <Check className="w-3 h-3 text-green-500" />;
      case 'failed': return <X className="w-3 h-3 text-red-500" />;
      default: return <Target className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Build System Selector */}
      <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Build System:</span>
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className={`h-7 px-2 rounded text-sm ${
              theme === 'dark' ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-gray-200'
            } border`}
          >
            {buildSystems.map(sys => (
              <option key={sys.id} value={sys.id}>{sys.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-1 flex">
        {/* Targets */}
        <div className={`w-56 border-r flex flex-col ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className={`p-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <span className="text-sm font-medium">Targets</span>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={runBuild}
                disabled={isBuilding}
              >
                {isBuilding ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 text-green-500" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Square className="w-3 h-3 text-red-500" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-1">
              {targets.map(target => (
                <button
                  key={target.id}
                  onClick={() => setSelectedTarget(target.name)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm ${
                    selectedTarget === target.name
                      ? theme === 'dark' ? 'bg-[#21262d]' : 'bg-gray-100'
                      : theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                  }`}
                >
                  {getStatusIcon(target.status)}
                  <span className="font-mono">{target.name}</span>
                  {target.duration && (
                    <span className="text-xs text-gray-500 ml-auto">{target.duration}</span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
          
          {/* Build All Button */}
          <div className="p-2 border-t border-[#30363d]">
            <Button className="w-full h-8" onClick={runBuild} disabled={isBuilding}>
              {isBuilding ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Build {selectedTarget}
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Right Panel: Logs + Dependencies */}
        <div className="flex-1 flex flex-col">
          {/* Dependency Graph */}
          <div className={`h-40 border-b p-2 ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Dependency Graph</h4>
            <div className={`h-28 rounded flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gray-50'
            }`}>
              <div className="text-center text-sm">
                <Layers className="w-8 h-8 mx-auto mb-1 text-gray-500" />
                <p className="text-gray-500">data → analysis → plots → report</p>
              </div>
            </div>
          </div>
          
          {/* Build Log */}
          <div className="flex-1 flex flex-col">
            <div className={`px-3 py-1 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
              <span className="text-sm font-medium">Build Output</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                Clear
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              <pre className={`p-2 text-xs font-mono ${
                theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gray-50'
              }`}>
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-500">[{log.timestamp}]</span>
                    <span className={getLogColor(log.level)}>{log.message}</span>
                  </div>
                ))}
              </pre>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
