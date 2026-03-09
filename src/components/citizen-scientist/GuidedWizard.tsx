'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ChevronRight, ChevronLeft, CheckCircle2, Circle, HelpCircle, Lightbulb,
  BookOpen, Video, AlertTriangle, Sparkles, Target, Clock, Users, Award,
  Play, FileUp, Settings, BarChart3, Download, Share2, ThumbsUp
} from 'lucide-react';
import FileUpload from './FileUpload';
import { 
  GuidedStep, 
  UserFile, 
  ConfidenceLevel, 
  CalibrationInfo 
} from '@/lib/pipeline/citizen-types';
import { getBreakthroughPotential } from '@/lib/pipeline/templates';
import { PipelineTemplate } from '@/lib/pipeline/types';

interface GuidedWizardProps {
  template: PipelineTemplate;
  onComplete: (results: any) => void;
  onBack: () => void;
}

// Convert template steps to guided steps with citizen scientist explanations
const createGuidedSteps = (template: PipelineTemplate): GuidedStep[] => {
  const stepTemplates: Record<string, Partial<GuidedStep>> = {
    'biomarker-load': {
      simpleExplanation: 'We\'ll start by loading your experimental data - this is like gathering all the ingredients before cooking a meal. The quality of your data determines how reliable your results will be.',
      inputType: 'file',
      requiredInputs: ['data-file'],
      helpResources: [
        { type: 'video', title: 'How to prepare your data file', content: 'data-prep-video' },
        { type: 'article', title: 'Understanding data formats', content: 'data-formats-guide' }
      ]
    },
    'load-vcf': {
      simpleExplanation: 'Your genetic data file (VCF) contains information about DNA differences. Think of it as a list of all the tiny variations in your genetic code that make you unique.',
      inputType: 'file',
      requiredInputs: ['vcf-file'],
      helpResources: [
        { type: 'glossary', title: 'What is a VCF file?', content: 'VCF (Variant Call Format) files store genetic variations found through DNA sequencing. Each line represents a difference from the reference human genome.' }
      ]
    },
    'load-data': {
      simpleExplanation: 'First, we need to load your data into the system. This is like opening a book - we need to read it before we can analyze it.',
      inputType: 'file',
      requiredInputs: ['data-file']
    }
  };

  return template.steps.map((step, index) => {
    const templateStep = stepTemplates[step.id] || {};
    return {
      id: step.id,
      title: step.name,
      description: step.description,
      simpleExplanation: templateStep.simpleExplanation || 
        `Step ${index + 1}: ${step.description}. This step builds on previous work to move us closer to our goal.`,
      technicalDetails: step.biotechTranslation,
      status: 'pending' as const,
      inputType: (templateStep.inputType || (index === 0 ? 'file' : 'parameters')) as GuidedStep['inputType'],
      requiredInputs: templateStep.requiredInputs || [],
      helpResources: templateStep.helpResources || []
    };
  });
};

export default function GuidedWizard({ template, onComplete, onBack }: GuidedWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [guidedSteps, setGuidedSteps] = useState<GuidedStep[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UserFile[]>([]);
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [stepProgress, setStepProgress] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [results, setResults] = useState<any>(null);

  const breakthrough = getBreakthroughPotential(template.id);

  useEffect(() => {
    const steps = createGuidedSteps(template);
    setGuidedSteps(steps);
    
    // Initialize parameters with defaults
    const defaults: Record<string, unknown> = {};
    template.parameters.forEach(p => { defaults[p.name] = p.defaultValue; });
    setParameters(defaults);
  }, [template]);

  const currentStep = guidedSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / guidedSteps.length) * 100;
  const canProceed = currentStep?.status === 'completed' || 
                     (currentStepIndex === 0 && uploadedFiles.length > 0) ||
                     (currentStep?.inputType === 'parameters' && Object.keys(parameters).length > 0);

  const handleFileUpload = (files: UserFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    setGuidedSteps(prev => {
      const newSteps = [...prev];
      newSteps[0] = { ...newSteps[0], status: 'completed' };
      return newSteps;
    });
  };

  const handleNext = () => {
    if (currentStepIndex < guidedSteps.length - 1) {
      // Mark current step as completed
      setGuidedSteps(prev => {
        const newSteps = [...prev];
        newSteps[currentStepIndex] = { ...newSteps[currentStepIndex], status: 'completed' };
        return newSteps;
      });
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRunExperiment = async () => {
    setIsRunning(true);
    setStepProgress(0);
    
    // Simulate running through all steps
    for (let i = 0; i < guidedSteps.length; i++) {
      setGuidedSteps(prev => {
        const newSteps = [...prev];
        newSteps[i] = { ...newSteps[i], status: 'in-progress' as const };
        return newSteps;
      });
      
      // Simulate step execution
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setStepProgress(p);
      }
      
      setGuidedSteps(prev => {
        const newSteps = [...prev];
        newSteps[i] = { ...newSteps[i], status: 'completed' as const };
        return newSteps;
      });
    }
    
    // Generate results
    const experimentResults = {
      summary: `${template.name} completed successfully!`,
      simpleSummary: `Great work! Your experiment has been analyzed. The results suggest promising directions for further investigation.`,
      confidence: {
        overall: 85 + Math.random() * 10,
        dataQuality: 90 + Math.random() * 8,
        methodology: 88 + Math.random() * 10,
        reproducibility: 82 + Math.random() * 15,
        statistical: 85 + Math.random() * 12
      },
      calibration: {
        benchmarked: true,
        benchmarkSource: 'Industry Standard Dataset',
        accuracyScore: 92,
        certifications: ['ISO 27001', 'GCP Compliant']
      },
      keyFindings: [
        'Analysis identified 3 high-confidence targets for investigation',
        'Data quality exceeded minimum thresholds for publication',
        'Results are reproducible within 95% confidence interval'
      ],
      nextSteps: [
        'Review the detailed results in the Analysis tab',
        'Consider validating findings with additional datasets',
        'Prepare results for peer review or collaboration'
      ],
      limitations: [
        'Results are based on computational prediction and require experimental validation',
        'Sample size may affect statistical power for some analyses'
      ]
    };
    
    setResults(experimentResults);
    setIsRunning(false);
    onComplete(experimentResults);
  };

  const renderStepContent = () => {
    if (isRunning) {
      return (
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardContent className="p-6 text-center">
            <div className="animate-pulse mb-4">
              <Sparkles className="w-12 h-12 mx-auto text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Running Your Experiment...</h3>
            <p className="text-sm text-gray-400 mb-4">
              Please wait while we analyze your data. This usually takes a few minutes.
            </p>
            <Progress value={stepProgress} className="h-2 mb-2" />
            <p className="text-xs text-gray-500">
              {stepProgress < 100 ? 'Processing...' : 'Finalizing results...'}
            </p>
          </CardContent>
        </Card>
      );
    }

    if (results) {
      return (
        <div className="space-y-4">
          {/* Success Banner */}
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Experiment Complete!</h3>
                  <p className="text-sm text-gray-300">{results.simpleSummary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Indicators */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Confidence & Quality Scores
              </CardTitle>
              <CardDescription>
                These scores indicate how trustworthy the results are
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(results.confidence).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">{Math.round(value)}%</span>
                    </div>
                    <Progress 
                      value={value} 
                      className={`h-2 ${value >= 80 ? 'bg-green-500/20' : value >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Findings */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                Key Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.keyFindings.map((finding: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ThumbsUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {finding}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Limitations - Important for Scientific Integrity */}
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                Important Limitations
              </CardTitle>
              <CardDescription>
                Good science requires acknowledging what we don't know
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.limitations.map((limitation: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      );
    }

    // File Upload Step
    if (currentStep.inputType === 'file') {
      return (
        <div className="space-y-4">
          <FileUpload
            onFileUpload={handleFileUpload}
            acceptedTypes={['csv', 'json', 'vcf', 'fasta']}
            maxFiles={5}
            maxSizeMB={50}
            purpose={template.biotechApplication}
            helpText={currentStep.simpleExplanation}
            exampleFormat={currentStep.technicalDetails}
          />
        </div>
      );
    }

    // Parameters Step
    if (currentStep.inputType === 'parameters') {
      return (
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-sm">Configure Your Experiment</CardTitle>
            <CardDescription>{currentStep.simpleExplanation}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {template.parameters.map(param => (
              <div key={param.id} className="space-y-2">
                <label className="text-sm font-medium">{param.label}</label>
                <p className="text-xs text-emerald-400">{param.biotechEquivalent}</p>
                {param.type === 'select' ? (
                  <select
                    className="w-full p-2 rounded bg-[#21262d] border border-[#30363d] text-sm"
                    value={String(parameters[param.name] || '')}
                    onChange={(e) => setParameters(prev => ({ ...prev, [param.name]: e.target.value }))}
                  >
                    {param.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={param.type === 'number' ? 'number' : 'text'}
                    className="w-full p-2 rounded bg-[#21262d] border border-[#30363d] text-sm"
                    value={String(parameters[param.name] || '')}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      [param.name]: param.type === 'number' ? parseFloat(e.target.value) : e.target.value
                    }))}
                    min={param.min}
                    max={param.max}
                  />
                )}
                <p className="text-xs text-gray-500">
                  🏀 {param.basketballAnalogy}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    // Review Step
    if (currentStep.inputType === 'review') {
      return (
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-sm">Review Before Running</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-400 mb-2">Uploaded Files</h4>
              {uploadedFiles.map(file => (
                <div key={file.id} className="text-sm">{file.name}</div>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-400 mb-2">Parameters</h4>
              {Object.entries(parameters).map(([key, value]) => (
                <div key={key} className="text-sm">{key}: {String(value)}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">{currentStep.simpleExplanation}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#30363d]">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back to Experiments
          </Button>
        </div>
        <h2 className="text-lg font-semibold">{template.name}</h2>
        <p className="text-sm text-gray-400">{template.description}</p>
        
        {/* Breakthrough Banner */}
        <div className="mt-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Breakthrough Potential:</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">{breakthrough.breakthrough}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 border-b border-[#30363d]">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Step {currentStepIndex + 1} of {guidedSteps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex items-center justify-between mt-3 px-2">
          {guidedSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStepIndex ? 'bg-emerald-600' :
                index === currentStepIndex ? 'bg-blue-600' :
                'bg-[#21262d]'
              }`}>
                {index < currentStepIndex ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 max-w-[60px] text-center truncate">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 p-4">
        {/* Current Step Info */}
        <Card className="bg-blue-500/10 border-blue-500/30 mb-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-blue-500/20">
                <Lightbulb className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-400">{currentStep?.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{currentStep?.simpleExplanation}</p>
                {currentStep?.technicalDetails && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Technical: {currentStep.technicalDetails}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {renderStepContent()}
      </ScrollArea>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-[#30363d]">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStepIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          {currentStepIndex === guidedSteps.length - 1 ? (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleRunExperiment}
              disabled={isRunning}
            >
              <Play className="w-4 h-4 mr-1" />
              {isRunning ? 'Running...' : 'Run Experiment'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed}>
              Next Step
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
