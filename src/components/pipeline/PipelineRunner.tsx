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
  Basketball, Dna, Zap, TrendingUp, BarChart3, Terminal, Award,
  Target, Heart, Brain, Bug, Sparkles, Activity, Rocket
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
import { getBreakthroughPotential } from '@/lib/pipeline/templates';

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

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'disease-cure': Heart,
  'virus-mutation': Bug,
  'gene-therapy': Dna,
  'physiology-modeling': Activity,
  'cancer-research': Target,
  'neurodegenerative': Brain,
  'rare-disease': Sparkles
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
      const defaultParams: Record<string, unknown> = {};
      template.parameters.forEach(param => {
        defaultParams[param.name] = param.defaultValue;
      });
      setParameters(defaultParams);

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

  // Simulate pipeline execution with medical context
  const runPipeline = async () => {
    if (!instance || !template) return;
    
    setIsRunning(true);
    setInstance(prev => prev ? { ...prev, status: 'running' } : null);
    
    const breakthrough = getBreakthroughPotential(template.id);
    addLog('info', `🚀 Starting pipeline: ${template.name}`);
    addLog('info', `🎯 Goal: ${breakthrough.breakthrough}`);
    addLog('info', `🏀 Basketball Context: ${template.basketballContext.slice(0, 100)}...`);

    for (let i = 0; i < instance.steps.length; i++) {
      const step = instance.steps[i];
      
      setInstance(prev => {
        if (!prev) return null;
        const newSteps = [...prev.steps];
        newSteps[i] = { ...newSteps[i], status: 'running', startTime: new Date(), progress: 0 };
        return { ...prev, steps: newSteps, progress: (i / prev.steps.length) * 100 };
      });
      
      addLog('info', `━━━ Step ${i + 1}/${instance.steps.length}: ${step.name} ━━━`, step.id);
      
      if (step.basketballAnalogy) {
        addLog('info', `🏀 ${step.basketballAnalogy}`, step.id);
      }
      if (step.biotechTranslation) {
        addLog('info', `🧬 ${step.biotechTranslation}`, step.id);
      }

      // Simulate step execution with progress
      for (let p = 0; p <= 100; p += 25) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setInstance(prev => {
          if (!prev) return null;
          const newSteps = [...prev.steps];
          newSteps[i] = { ...newSteps[i], progress: p };
          return { ...prev, steps: newSteps };
        });
      }

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
      
      addLog('success', `✅ Step ${i + 1} completed`, step.id);
    }

    // Generate medically-relevant results
    const results: PipelineResult = generateMedicalResults(template, parameters);
    
    setInstance(prev => prev ? { 
      ...prev, 
      status: 'completed', 
      progress: 100, 
      completedAt: new Date(),
      results 
    } : null);
    
    addLog('success', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addLog('success', '🎉 PIPELINE COMPLETED SUCCESSFULLY!');
    addLog('success', `💡 ${breakthrough.breakthrough}`);
    addLog('info', `📊 Impact: ${breakthrough.impact}`);
    addLog('info', `⏱️ Timeline: ${breakthrough.timeline}`);
    
    setIsRunning(false);
    
    if (onPipelineComplete) {
      onPipelineComplete(results);
    }
  };

  // Generate medically-relevant simulation results
  const generateMedicalResults = (template: PipelineTemplate, params: Record<string, unknown>): PipelineResult => {
    const baseResults: PipelineResult = {
      summary: `Pipeline "${template.name}" completed successfully. Analysis indicates strong potential for therapeutic intervention.`,
      metrics: {
        efficacy: 0.85 + Math.random() * 0.1,
        safety: 0.92 + Math.random() * 0.05,
        probability: 0.75 + Math.random() * 0.15,
        confidence: 0.88 + Math.random() * 0.08
      },
      basketballStats: {
        FG_PCT: 45 + Math.random() * 10,
        AST: 22 + Math.random() * 8,
        REB: 40 + Math.random() * 10,
        TOV: 10 + Math.random() * 5,
        PLUS_MINUS: 6 + Math.random() * 8
      },
      biotechEquivalents: {
        therapeuticEfficiency: 0,
        synergyIndex: 0,
        recaptureRate: 0,
        adverseRisk: 0,
        therapeuticIndex: 0
      },
      interpretation: '',
      recommendations: []
    };

    // Calculate biotech equivalents from basketball stats
    baseResults.biotechEquivalents = {
      therapeuticEfficiency: baseResults.basketballStats.FG_PCT,
      synergyIndex: baseResults.basketballStats.AST,
      recaptureRate: baseResults.basketballStats.REB,
      adverseRisk: baseResults.basketballStats.TOV,
      therapeuticIndex: baseResults.basketballStats.PLUS_MINUS
    };

    // Template-specific results
    switch (template.id) {
      case 'alzheimer-reversal':
        baseResults.summary = 'Multi-target Alzheimer\'s therapy combination identified with predicted 40% cognitive improvement.';
        baseResults.metrics = { 
          ...baseResults.metrics,
          amyloidClearance: 65 + Math.random() * 20,
          tauReduction: 45 + Math.random() * 15,
          cognitiveImprovement: 35 + Math.random() * 15
        };
        baseResults.interpretation = 'The optimized drug combination shows strong potential for amyloid clearance while simultaneously reducing tau tangles. The blood-brain barrier penetration analysis indicates therapeutic concentrations achievable in the hippocampus and cortex.';
        baseResults.recommendations = [
          'Proceed to Phase II clinical trial with identified combination therapy',
          'Monitor CSF biomarkers for amyloid-beta and tau reduction',
          'Consider patient stratification based on APOE4 status',
          'Establish cognitive assessment endpoints using ADAS-Cog and CDR-SB'
        ];
        break;
        
      case 'cancer-immunotherapy':
        baseResults.summary = 'CAR-T construct optimized for solid tumor infiltration with predicted 75% response rate.';
        baseResults.metrics = {
          ...baseResults.metrics,
          tumorInfiltration: 70 + Math.random() * 20,
          exhaustionResistance: 80 + Math.random() * 15,
          tumorKillRate: 85 + Math.random() * 10
        };
        baseResults.interpretation = 'The engineered CAR-T cells demonstrate enhanced tumor infiltration capability through chemokine receptor matching. Exhaustion-resistant modifications including PD-1 knockout show sustained cytotoxic activity over 30+ days in simulation.';
        baseResults.recommendations = [
          'Proceed to IND-enabling studies with optimized CAR construct',
          'Implement safety switch (iCasp9) for CRS management',
          'Design basket trial across multiple solid tumor types',
          'Monitor cytokine profiles for CRS prediction'
        ];
        break;
        
      case 'universal-vaccine':
        baseResults.summary = 'Conserved epitopes identified across viral family with 95% coverage of known variants.';
        baseResults.metrics = {
          ...baseResults.metrics,
          conservationScore: 92 + Math.random() * 6,
          neutralizingAntibodyTiter: 8.5 + Math.random() * 2,
          breadthOfProtection: 88 + Math.random() * 10
        };
        baseResults.interpretation = 'Structural analysis identified 4 highly conserved epitopes with <0.1% mutation rate across 10,000+ viral sequences. The designed immunogen elicits broadly neutralizing antibodies with predicted cross-reactivity against future variants.';
        baseResults.recommendations = [
          'Advance immunogen to Phase I clinical trial',
          'Establish correlates of protection for regulatory pathway',
          'Design universal vaccine manufacturing platform',
          'Monitor emerging variants for continued coverage'
        ];
        break;
        
      case 'crispr-cure-design':
        baseResults.summary = 'CRISPR gene editing protocol designed with >90% on-target efficiency and <0.01% off-target risk.';
        baseResults.metrics = {
          ...baseResults.metrics,
          onTargetEfficiency: 88 + Math.random() * 10,
          offTargetRisk: 0.005 + Math.random() * 0.005,
          editingPersistence: 95 + Math.random() * 4
        };
        baseResults.interpretation = 'The designed guide RNA achieves exceptional on-target efficiency with minimal off-target sites. Prime editing approach eliminates double-strand break risk. Delivery optimization indicates >80% transduction of target cells.';
        baseResults.recommendations = [
          'Proceed to IND submission with preclinical safety data',
          'Design natural history study for endpoint selection',
          'Establish manufacturing process for GMP production',
          'Consider patient eligibility based on genotype'
        ];
        break;
        
      case 'digital-twin-therapy':
        baseResults.summary = 'Digital twin model predicts optimal personalized treatment regimen with 92% accuracy.';
        baseResults.metrics = {
          ...baseResults.metrics,
          modelAccuracy: 90 + Math.random() * 8,
          predictionConfidence: 85 + Math.random() * 10,
          outcomeImprovement: 40 + Math.random() * 20
        };
        baseResults.interpretation = 'The multi-scale physiological model successfully predicts drug response based on patient-specific parameters. Simulation indicates 40% improvement in treatment outcomes compared to standard of care.';
        baseResults.recommendations = [
          'Implement digital twin in clinical decision support system',
          'Validate predictions against historical patient data',
          'Design prospective clinical trial comparing twin-guided vs standard care',
          'Establish real-time data integration pipeline'
        ];
        break;
        
      default:
        baseResults.interpretation = 'The pipeline analysis indicates significant therapeutic potential. Further investigation and clinical validation recommended.';
        baseResults.recommendations = [
          'Review detailed results with clinical team',
          'Plan next-phase experiments based on findings',
          'Consider publication of methodology and preliminary results'
        ];
    }

    return baseResults;
  };

  const pausePipeline = () => {
    setInstance(prev => prev ? { ...prev, status: 'paused' } : null);
    addLog('warning', '⏸️ Pipeline paused');
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
          <Rocket className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select an experiment pipeline to begin</p>
          <p className="text-xs mt-2 text-emerald-400">Choose from disease cures, gene therapies, and breakthrough research</p>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[template.category] || Dna;
  const breakthrough = getBreakthroughPotential(template.id);

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
            <CategoryIcon className="w-5 h-5 text-emerald-400" />
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
        
        {/* Breakthrough Banner */}
        <div className="mt-2 p-2 bg-emerald-500/10 rounded border border-emerald-500/30">
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <Award className="w-3 h-3" />
            Breakthrough Potential: {breakthrough.breakthrough}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Steps Panel */}
        <div className="flex-1 border-r border-[#30363d] flex flex-col">
          {/* Parameters */}
          <div className="p-3 border-b border-[#30363d]">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Configuration</h3>
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
                Run Experiment
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
        <div className="w-96 flex flex-col">
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
                    
                    {/* Key Metrics */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(instance.results.metrics).slice(0, 6).map(([key, value]) => (
                          <div key={key} className="p-2 bg-[#161b22] rounded text-center">
                            <div className="text-lg font-bold text-blue-400">
                              {typeof value === 'number' ? (value < 1 ? `${(value * 100).toFixed(1)}%` : value.toFixed(1)) : value}
                            </div>
                            <div className="text-[10px] text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Interpretation */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Scientific Interpretation</h4>
                      <p className="text-xs text-gray-300 bg-[#161b22] p-3 rounded">
                        {instance.results.interpretation}
                      </p>
                    </div>
                    
                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                      <ul className="space-y-1">
                        {instance.results.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-gray-300 flex gap-2">
                            <Zap className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Breakthrough Impact */}
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <h4 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Breakthrough Impact
                      </h4>
                      <p className="text-xs text-gray-300 mb-2">{breakthrough.impact}</p>
                      <p className="text-xs text-purple-300">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Timeline: {breakthrough.timeline}
                      </p>
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

// Simple Tabs component
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
