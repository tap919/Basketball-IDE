'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Play, Pause, Square, RotateCcw, CheckCircle2, Circle, Loader2, 
  AlertCircle, ChevronDown, ChevronRight, ArrowRight, Clock,
  Basketball, Dna, Zap, TrendingUp, BarChart3, Terminal
} from 'lucide-react';
import { 
  PipelineTemplate, 
  PipelineInstance, 
  PipelineStep, 
  PipelineStatus,
  PipelineLog,
  StepStatus,
  PipelineResult
} from '@/lib/pipeline/types';

interface PipelineRunnerProps {
  theme: string;
  template: PipelineTemplate | null;
  onBack: () => void;
  onPipelineComplete?: (result: PipelineResult) => void;
}

const stepStatusIcons: Record<StepStatus, React.ComponentType<{ className?: string }>> = {
  pending: Circle,
  running: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle,
  skipped: Circle
};

const stepStatusColors: Record<StepStatus, string> = {
  pending: 'text-gray-500',
  running: 'text-blue-400 animate-spin',
  completed: 'text-green-400',
  failed: 'text-red-400',
  skipped: 'text-gray-600'
};

export default function PipelineRunner({ theme, template, onBack, onPipelineComplete }: PipelineRunnerProps) {
  const [instance, setInstance] = useState<PipelineInstance | null>(null);
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [logs, setLogs] = useState<PipelineLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize instance when template changes
  useEffect(() => {
    if (template) {
      // Set default parameters
      const defaultParams: Record<string, unknown> = {};
      template.parameters.forEach(param => {
        defaultParams[param.name] = param.defaultValue;
      });
      setParameters(defaultParams);

      // Create instance
      const newInstance: PipelineInstance = {
        id: `pipeline-${Date.now()}`,
        templateId: template.id,
        name: template.name,
        status: 'idle',
        progress: 0,
        steps: template.steps.map(step => ({
          ...step,
          status: 'pending' as StepStatus,
          progress: 0
        })),
        parameters: defaultParams,
        createdAt: new Date()
      };
      setInstance(newInstance);
      setLogs([]);
      setExpandedSteps([]);
    }
  }, [template]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const addLog = useCallback((level: PipelineLog['level'], message: string, stepId?: string) => {
    setLogs(prev => [...prev, { timestamp: new Date(), level, message, stepId }]);
  }, []);

  // Simulate pipeline execution
  const runPipeline = async () => {
    if (!instance || !template) return;
    
    setIsRunning(true);
    setInstance(prev => prev ? { ...prev, status: 'running' } : null);
    addLog('info', `Starting pipeline: ${template.name}`);
    addLog('info', `Basketball Context: ${template.basketballContext}`);

    for (let i = 0; i < instance.steps.length; i++) {
      const step = instance.steps[i];
      
      // Update step to running
      setInstance(prev => {
        if (!prev) return null;
        const newSteps = [...prev.steps];
        newSteps[i] = { ...newSteps[i], status: 'running', startTime: new Date(), progress: 0 };
        return { ...prev, steps: newSteps, progress: (i / prev.steps.length) * 100 };
      });
      
      addLog('info', `Step ${i + 1}: ${step.name}`, step.id);
      if (step.basketballAnalogy) {
        addLog('info', `🏀 ${step.basketballAnalogy}`, step.id);
      }
      if (step.biotechTranslation) {
        addLog('info', `🧬 ${step.biotechTranslation}`, step.id);
      }

      // Simulate step execution with progress
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setInstance(prev => {
          if (!prev) return null;
          const newSteps = [...prev.steps];
          newSteps[i] = { ...newSteps[i], progress: p };
          return { ...prev, steps: newSteps };
        });
      }

      // Complete step
      setInstance(prev => {
        if (!prev) return null;
        const newSteps = [...prev.steps];
        newSteps[i] = { 
          ...newSteps[i], 
          status: 'completed', 
          progress: 100, 
          endTime: new Date(),
          output: { result: `Step ${i + 1} completed successfully` }
        };
        return { ...prev, steps: newSteps };
      });
      
      addLog('success', `✓ Step ${i + 1} completed`, step.id);
    }

    // Generate results
    const results: PipelineResult = {
      summary: `Pipeline "${template.name}" completed successfully with all ${template.steps.length} steps.`,
      metrics: {
        duration: 180,
        efficiency: 0.95,
        accuracy: 0.92
      },
      basketballStats: {
        FG_PCT: 47.2,
        AST: 25.6,
        REB: 42.1,
        TOV: 12.3,
        PLUS_MINUS: 8.5
      },
      biotechEquivalents: {
        transfectionEfficiency: 47.2,
        synergyIndex: 25.6,
        recaptureRate: 42.1,
        adverseEvents: 12.3,
        therapeuticIndex: 8.5
      },
      interpretation: 'The simulation demonstrates strong correlation between basketball performance metrics and biotech research outcomes. High transfection efficiency (FG%) indicates effective gene delivery, while the positive therapeutic index (+/-) suggests favorable safety profile.',
      recommendations: [
        'Consider optimizing synergy indicators (assists) for improved combination therapies',
        'Monitor adverse events (turnovers) closely during clinical phases',
        'Leverage strong recapture rates (rebounds) for recycling strategies'
      ]
    };

    setInstance(prev => prev ? { 
      ...prev, 
      status: 'completed', 
      progress: 100, 
      completedAt: new Date(),
      results 
    } : null);
    
    addLog('success', 'Pipeline completed successfully!');
    setIsRunning(false);
    
    if (onPipelineComplete) {
      onPipelineComplete(results);
    }
  };

  const pausePipeline = () => {
    setInstance(prev => prev ? { ...prev, status: 'paused' } : null);
    addLog('warning', 'Pipeline paused');
    setIsRunning(false);
  };

  const resetPipeline = () => {
    if (!template) return;
    
    const newInstance: PipelineInstance = {
      id: `pipeline-${Date.now()}`,
      templateId: template.id,
      name: template.name,
      status: 'idle',
      progress: 0,
      steps: template.steps.map(step => ({
        ...step,
        status: 'pending' as StepStatus,
        progress: 0
      })),
      parameters,
      createdAt: new Date()
    };
    setInstance(newInstance);
    setLogs([]);
    setIsRunning(false);
  };

  if (!template || !instance) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Dna className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select an experiment template to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#30363d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h2 className="text-sm font-semibold">{template.name}</h2>
              <p className="text-xs text-gray-500">{template.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${
              instance.status === 'completed' ? 'text-green-400 border-green-600' :
              instance.status === 'running' ? 'text-blue-400 border-blue-600' :
              instance.status === 'paused' ? 'text-yellow-400 border-yellow-600' :
              'text-gray-400'
            }`}>
              {instance.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {Math.round(instance.progress)}%
            </Badge>
          </div>
        </div>
        <Progress value={instance.progress} className="h-1 mt-2" />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Steps Panel */}
        <div className="flex-1 border-r border-[#30363d] flex flex-col">
          {/* Parameters */}
          <div className="p-3 border-b border-[#30363d]">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Parameters</h3>
            <div className="grid grid-cols-2 gap-2">
              {template.parameters.map(param => (
                <div key={param.id} className="space-y-1">
                  <label className="text-xs text-gray-400 flex items-center justify-between">
                    <span>{param.label}</span>
                    <span className="text-emerald-400 text-[10px]">
                      {param.biotechEquivalent}
                    </span>
                  </label>
                  {param.type === 'select' ? (
                    <select 
                      className={`w-full h-8 px-2 rounded text-sm ${theme === 'dark' ? 'bg-[#21262d] border-[#30363d]' : 'bg-white border-gray-200'} border`}
                      value={String(parameters[param.name] || '')}
                      onChange={(e) => setParameters(prev => ({ ...prev, [param.name]: e.target.value }))}
                      disabled={isRunning}
                    >
                      {param.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Input 
                      type={param.type === 'number' ? 'number' : 'text'}
                      className="h-8 text-sm"
                      value={String(parameters[param.name] || '')}
                      onChange={(e) => setParameters(prev => ({ 
                        ...prev, 
                        [param.name]: param.type === 'number' ? parseFloat(e.target.value) : e.target.value 
                      }))}
                      disabled={isRunning}
                      min={param.min}
                      max={param.max}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {instance.steps.map((step, index) => {
                const StatusIcon = stepStatusIcons[step.status];
                const isExpanded = expandedSteps.includes(step.id);
                
                return (
                  <Card key={step.id} className={`bg-[#161b22] border-[#30363d] ${
                    step.status === 'running' ? 'border-blue-500' : ''
                  }`}>
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleStep(step.id)}>
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <StatusIcon className={`w-4 h-4 ${stepStatusColors[step.status]}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{step.name}</CardTitle>
                            <span className="text-xs text-gray-500">Step {index + 1}</span>
                          </div>
                          <CardDescription className="text-xs mt-0.5">{step.description}</CardDescription>
                        </div>
                      </div>
                      {step.status === 'running' && (
                        <Progress value={step.progress} className="h-1 mt-2" />
                      )}
                    </CardHeader>
                    
                    {isExpanded && (step.basketballAnalogy || step.biotechTranslation) && (
                      <CardContent className="p-3 pt-0">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {step.basketballAnalogy && (
                            <div className="p-2 bg-orange-500/10 rounded border border-orange-500/30">
                              <div className="flex items-center gap-1 text-orange-400 mb-1">
                                <Basketball className="w-3 h-3" />
                                Basketball Analogy
                              </div>
                              <p className="text-gray-300">{step.basketballAnalogy}</p>
                            </div>
                          )}
                          {step.biotechTranslation && (
                            <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/30">
                              <div className="flex items-center gap-1 text-emerald-400 mb-1">
                                <Dna className="w-3 h-3" />
                                Biotech Translation
                              </div>
                              <p className="text-gray-300">{step.biotechTranslation}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          {/* Controls */}
          <div className="p-3 border-t border-[#30363d] flex gap-2">
            {instance.status !== 'running' && instance.status !== 'completed' && (
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={runPipeline}>
                <Play className="w-4 h-4 mr-2" />
                Run Pipeline
              </Button>
            )}
            {instance.status === 'running' && (
              <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700" onClick={pausePipeline}>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            {(instance.status === 'completed' || instance.status === 'paused' || instance.status === 'failed') && (
              <Button className="flex-1" variant="outline" onClick={resetPipeline}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Logs & Results Panel */}
        <div className="w-80 flex flex-col">
          <Tabs defaultValue="logs" className="h-full flex flex-col">
            <div className="flex border-b border-[#30363d]">
              <TabsList className="bg-transparent flex-1">
                <TabsTrigger value="logs" className="flex-1 data-[state=active]:bg-[#21262d]">
                  <Terminal className="w-3 h-3 mr-1" />
                  Logs
                </TabsTrigger>
                <TabsTrigger value="results" className="flex-1 data-[state=active]:bg-[#21262d]">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Results
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="logs" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full p-3">
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`${
                        log.level === 'success' ? 'text-green-400' :
                        log.level === 'error' ? 'text-red-400' :
                        log.level === 'warning' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}
                    >
                      <span className="text-gray-600">[{log.timestamp.toLocaleTimeString()}]</span> {log.message}
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      No logs yet. Run the pipeline to see execution logs.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="results" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full p-3">
                {instance.results ? (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                      <h4 className="text-sm font-medium text-emerald-400 mb-2">Summary</h4>
                      <p className="text-xs text-gray-300">{instance.results.summary}</p>
                    </div>
                    
                    {/* Metrics */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(instance.results.metrics).map(([key, value]) => (
                          <div key={key} className="p-2 bg-[#161b22] rounded text-center">
                            <div className="text-lg font-bold text-blue-400">
                              {typeof value === 'number' ? value.toFixed(2) : value}
                            </div>
                            <div className="text-xs text-gray-500">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Translation Results */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Basketball → Biotech Translation</h4>
                      <div className="space-y-2">
                        {Object.entries(instance.results.basketballStats).map(([key, value]) => {
                          const biotechKey = Object.keys(instance.results!.biotechEquivalents)[
                            Object.keys(instance.results!.basketballStats).indexOf(key)
                          ];
                          const biotechValue = instance.results!.biotechEquivalents[biotechKey];
                          
                          return (
                            <div key={key} className="flex items-center gap-2 p-2 bg-[#161b22] rounded">
                              <div className="flex-1">
                                <div className="text-xs text-orange-400">{key}</div>
                                <div className="font-mono">{typeof value === 'number' ? value.toFixed(1) : value}</div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-500" />
                              <div className="flex-1 text-right">
                                <div className="text-xs text-emerald-400">{biotechKey}</div>
                                <div className="font-mono">{typeof biotechValue === 'number' ? biotechValue.toFixed(1) : biotechValue}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {instance.results.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-gray-300 flex gap-2">
                            <Zap className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Run the pipeline to see results</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Simple Tabs component for this file
function Tabs({ defaultValue, children, className }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext<{ value: string; setValue: (v: string) => void }>({ value: '', setValue: () => {} });

function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;
  return (
    <button
      className={`p-2 text-sm ${isActive ? 'bg-[#21262d]' : ''} ${className}`}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext);
  if (context.value !== value) return null;
  return <div className={className}>{children}</div>;
}

import React from 'react';
