'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Play, Pause, StepInto, StepOver, StepOut, Square, RefreshCw,
  Bug, ChevronRight, ChevronDown, AlertCircle, Check, Circle, Layers
} from 'lucide-react';

interface DebuggerPanelProps {
  theme: string;
}

interface Breakpoint {
  id: string;
  file: string;
  line: number;
  enabled: boolean;
  condition?: string;
}

interface StackFrame {
  id: string;
  function: string;
  file: string;
  line: number;
  variables: { name: string; value: string; type: string }[];
}

interface WatchVar {
  id: string;
  expression: string;
  value: string;
  type: string;
}

const sampleBreakpoints: Breakpoint[] = [
  { id: '1', file: 'analysis.py', line: 42, enabled: true },
  { id: '2', file: 'analysis.py', line: 87, enabled: true, condition: 'fg_pct > 0.5' },
  { id: '3', file: 'biotech_convert.py', line: 23, enabled: false },
];

const sampleStack: StackFrame[] = [
  {
    id: '1',
    function: 'calculate_biotech_metrics',
    file: 'analysis.py',
    line: 42,
    variables: [
      { name: 'df', value: 'DataFrame(24847×35)', type: 'pandas.DataFrame' },
      { name: 'team_name', value: "'Boston Celtics'", type: 'str' },
      { name: 'fg_pct', value: '0.475', type: 'float' }
    ]
  },
  {
    id: '2',
    function: 'main',
    file: 'analysis.py',
    line: 87,
    variables: [
      { name: 'season', value: "'2023-24'", type: 'str' },
      { name: 'output_dir', value: "'/results'", type: 'str' }
    ]
  }
];

const sampleWatches: WatchVar[] = [
  { id: '1', expression: 'fg_pct', value: '0.475', type: 'float' },
  { id: '2', expression: 'df.shape', value: '(24847, 35)', type: 'tuple' },
  { id: '3', expression: 'len(teams)', value: '30', type: 'int' }
];

export default function DebuggerPanel({ theme }: DebuggerPanelProps) {
  const [breakpoints, setBreakpoints] = useState(sampleBreakpoints);
  const [stackFrames, setStackFrames] = useState(sampleStack);
  const [watches, setWatches] = useState(sampleWatches);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [debugState, setDebugState] = useState<'idle' | 'running' | 'paused'>('paused');
  const [currentLine, setCurrentLine] = useState(42);

  const toggleBreakpoint = (id: string) => {
    setBreakpoints(prev => prev.map(bp => 
      bp.id === id ? { ...bp, enabled: !bp.enabled } : bp
    ));
  };

  const addWatch = (expression: string) => {
    const newWatch: WatchVar = {
      id: Date.now().toString(),
      expression,
      value: '...',
      type: 'unknown'
    };
    setWatches(prev => [...prev, newWatch]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Debug Toolbar */}
      <div className={`flex items-center gap-1 px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <Button variant="ghost" size="sm" className="h-7 px-2">
          <Play className="w-4 h-4 text-green-500 mr-1" />
          Start
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2" disabled={debugState !== 'paused'}>
          <StepOver className="w-4 h-4 mr-1" />
          Step Over
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2" disabled={debugState !== 'paused'}>
          <StepInto className="w-4 h-4 mr-1" />
          Step Into
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2" disabled={debugState !== 'paused'}>
          <StepOut className="w-4 h-4 mr-1" />
          Step Out
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2">
          <Square className="w-4 h-4 text-red-500 mr-1" />
          Stop
        </Button>
        
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${
            debugState === 'paused' ? 'border-yellow-500 text-yellow-500' :
            debugState === 'running' ? 'border-green-500 text-green-500' :
            'border-gray-500 text-gray-500'
          }`}>
            {debugState === 'paused' ? 'Paused' : debugState === 'running' ? 'Running' : 'Idle'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Python 3.11
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 flex">
        {/* Left: Breakpoints + Stack */}
        <div className={`w-64 border-r flex flex-col ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          {/* Breakpoints */}
          <div className={`border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">BREAKPOINTS</span>
              <Badge variant="outline" className="text-xs">{breakpoints.length}</Badge>
            </div>
            <ScrollArea className="h-32">
              {breakpoints.map(bp => (
                <div
                  key={bp.id}
                  className={`flex items-center gap-2 px-2 py-1 text-xs ${
                    theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={bp.enabled}
                    onChange={() => toggleBreakpoint(bp.id)}
                    className="w-3 h-3"
                  />
                  <span className="text-red-500">●</span>
                  <span className="font-mono truncate">{bp.file}:{bp.line}</span>
                  {bp.condition && (
                    <Badge variant="outline" className="text-xs">cond</Badge>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
          
          {/* Call Stack */}
          <div className="flex-1 flex flex-col">
            <div className="px-2 py-1">
              <span className="text-xs font-semibold text-gray-500">CALL STACK</span>
            </div>
            <ScrollArea className="flex-1">
              {stackFrames.map((frame, i) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(i)}
                  className={`w-full text-left px-2 py-1.5 text-xs ${
                    selectedFrame === i
                      ? theme === 'dark' ? 'bg-[#21262d]' : 'bg-gray-100'
                      : theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-mono">{frame.function}()</div>
                  <div className="text-gray-500 truncate">{frame.file}:{frame.line}</div>
                </button>
              ))}
            </ScrollArea>
          </div>
        </div>
        
        {/* Middle: Code View */}
        <div className="flex-1 flex flex-col">
          <div className={`px-3 py-1 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <span className="text-sm font-mono">analysis.py</span>
          </div>
          <ScrollArea className="flex-1">
            <div className={`p-2 font-mono text-sm ${
              theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gray-50'
            }`}>
              {[38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48].map(line => (
                <div
                  key={line}
                  className={`flex items-center gap-2 px-2 ${
                    line === currentLine 
                      ? 'bg-yellow-500/20 border-l-2 border-yellow-500' 
                      : ''
                  }`}
                >
                  <span className="w-8 text-right text-gray-500 select-none">{line}</span>
                  <span className={line === 42 ? 'text-blue-400' : 'text-gray-300'}>
                    {line === 42 ? '→  transfection = fg_pct * 100' :
                     line === 43 ? '   print(f"Team: {team_name}")' :
                     line === 44 ? '   return {' :
                     line === 45 ? '     "efficiency": transfection,' :
                     line === 46 ? '     "specificity": fg3_pct * 100' :
                     line === 47 ? '   }' :
                     '# ...'}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Right: Variables + Watches */}
        <div className={`w-64 border-l flex flex-col ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          {/* Variables */}
          <div className={`border-b flex-1 flex flex-col ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <div className="px-2 py-1">
              <span className="text-xs font-semibold text-gray-500">LOCALS</span>
            </div>
            <ScrollArea className="flex-1">
              {stackFrames[selectedFrame]?.variables.map((v, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-2 py-1 text-xs ${
                    theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="font-mono text-blue-400">{v.name}</span>
                  <span className="text-gray-300">{v.value}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
          
          {/* Watch */}
          <div className="flex-1 flex flex-col">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">WATCH</span>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">+</Button>
            </div>
            <ScrollArea className="flex-1">
              {watches.map(watch => (
                <div
                  key={watch.id}
                  className={`flex items-center justify-between px-2 py-1 text-xs ${
                    theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="font-mono text-purple-400">{watch.expression}</span>
                  <span className="text-gray-300">{watch.value}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
      
      {/* Debug Console */}
      <div className={`border-t ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className="px-3 py-1 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">DEBUG CONSOLE</span>
        </div>
        <Input
          placeholder=">>> "
          className={`h-8 text-sm font-mono border-0 ${
            theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gray-50'
          }`}
        />
      </div>
    </div>
  );
}
