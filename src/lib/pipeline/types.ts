// Pipeline Types for Basketball-to-Biotech Simulations

export type PipelineStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
  progress: number; // 0-100
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  startTime?: Date;
  endTime?: Date;
  basketballAnalogy?: string;
  biotechTranslation?: string;
}

export interface PipelineTemplate {
  id: string;
  name: string;
  category: ExperimentCategory;
  description: string;
  basketballContext: string;
  biotechApplication: string;
  steps: Omit<PipelineStep, 'status' | 'progress' | 'startTime' | 'endTime' | 'output' | 'error'>[];
  parameters: PipelineParameter[];
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface PipelineParameter {
  id: string;
  name: string;
  label: string;
  type: 'number' | 'string' | 'select' | 'boolean' | 'dataRange';
  defaultValue: string | number | boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  basketballAnalogy: string;
  biotechEquivalent: string;
}

export type ExperimentCategory = 
  | 'drug-discovery'
  | 'clinical-trial'
  | 'genomics'
  | 'protein-engineering'
  | 'pharmacokinetics'
  | 'bioinformatics'
  | 'biomarker-analysis';

export interface PipelineInstance {
  id: string;
  templateId: string;
  name: string;
  status: PipelineStatus;
  progress: number;
  steps: PipelineStep[];
  parameters: Record<string, unknown>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  results?: PipelineResult;
}

export interface PipelineResult {
  summary: string;
  metrics: Record<string, number>;
  basketballStats: Record<string, number>;
  biotechEquivalents: Record<string, number>;
  interpretation: string;
  recommendations: string[];
}

export interface PipelineExecutionContext {
  instance: PipelineInstance;
  currentStepIndex: number;
  logs: PipelineLog[];
}

export interface PipelineLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  stepId?: string;
}
