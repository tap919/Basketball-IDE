// Citizen Scientist Types - Simplified interfaces for non-expert users

export interface UserFile {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'vcf' | 'fasta' | 'pdb' | 'sdf' | 'unknown';
  size: number;
  uploadedAt: Date;
  preview?: string[];
  headers?: string[];
  rowCount?: number;
  validated: boolean;
  validationErrors?: string[];
  metadata?: FileMetadata;
}

export interface FileMetadata {
  dataType?: string;
  columns?: ColumnInfo[];
  sampleSize?: number;
  dateRange?: { start: string; end: string };
  format: string;
  encoding: string;
}

export interface ColumnInfo {
  name: string;
  type: 'numeric' | 'text' | 'date' | 'categorical' | 'unknown';
  sampleValues: string[];
  nullCount: number;
  uniqueCount: number;
}

export interface ConfidenceLevel {
  overall: number; // 0-100
  dataQuality: number;
  methodology: number;
  reproducibility: number;
  statistical: number;
}

export interface CalibrationInfo {
  benchmarked: boolean;
  benchmarkSource: string;
  accuracyScore: number;
  lastCalibrated: Date;
  nextCalibration: Date;
  certifications: string[];
}

export interface GuidedStep {
  id: string;
  title: string;
  description: string;
  simpleExplanation: string; // Plain language explanation
  technicalDetails?: string; // For those who want more depth
  status: 'pending' | 'in-progress' | 'completed' | 'needs-input';
  inputType?: 'file' | 'parameters' | 'selection' | 'review';
  requiredInputs: string[];
  helpResources: HelpResource[];
}

export interface HelpResource {
  type: 'video' | 'article' | 'example' | 'glossary';
  title: string;
  url?: string;
  content?: string;
}

export interface ExperimentResult {
  id: string;
  pipelineId: string;
  completedAt: Date;
  summary: string;
  simpleSummary: string; // Non-technical summary for citizen scientists
  keyFindings: string[];
  confidence: ConfidenceLevel;
  calibration: CalibrationInfo;
  visualizations: VisualizationInfo[];
  downloadableFiles: DownloadableFile[];
  nextSteps: string[];
  scientificNotes: string;
  limitations: string[];
  peerReviewReady: boolean;
}

export interface VisualizationInfo {
  id: string;
  type: 'chart' | 'table' | 'network' | 'heatmap' | 'sequence';
  title: string;
  description: string;
  interpretation: string; // What does this mean for non-experts
}

export interface DownloadableFile {
  name: string;
  format: string;
  size: number;
  description: string;
  purpose: string; // How this file would be used
}

export interface UserProfile {
  id: string;
  name: string;
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  completedExperiments: string[];
  achievements: Achievement[];
  reputationScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earnedAt: Date;
  icon: string;
}

export interface ScientificValidation {
  methodology: string;
  citations: string[];
  benchmarkDataset: string;
  expectedAccuracy: number;
  limitations: string[];
  assumptions: string[];
}

export interface TrustIndicators {
  dataQualityScore: number;
  methodTransparency: number;
  reproducibilityScore: number;
  peerValidationCount: number;
  expertReviewStatus: 'pending' | 'reviewed' | 'validated' | 'certified';
}
