// Main Pipeline Templates Export - Combines all template categories
import { PipelineTemplate, ExperimentCategory } from './types';
import { medicalPipelineTemplates, medicalCategories, getBreakthroughPotential } from './medical-templates';
import { basketballBiotechAnalogies } from '../translation/analogies';

// Re-export medical templates and categories
export { medicalPipelineTemplates, medicalCategories, getBreakthroughPotential };

// All available templates
export const pipelineTemplates: PipelineTemplate[] = [...medicalPipelineTemplates];

// All categories
export const experimentCategories = medicalCategories;

// Category icons mapping
export const categoryIcons: Record<string, string> = {
  'disease-cure': 'Heart',
  'virus-mutation': 'Bug',
  'gene-therapy': 'Dna',
  'physiology-modeling': 'Activity',
  'cancer-research': 'Target',
  'neurodegenerative': 'Brain',
  'rare-disease': 'Sparkles',
  'drug-discovery': 'Pill',
  'clinical-trial': 'ClipboardList',
  'genomics': 'Dna',
  'protein-engineering': 'Atom',
  'pharmacokinetics': 'Activity',
  'bioinformatics': 'Database',
  'biomarker-analysis': 'Target'
};

// Helper functions
export const getTemplatesByCategory = (category: ExperimentCategory): PipelineTemplate[] => {
  return pipelineTemplates.filter(t => t.category === category);
};

export const getTemplateById = (id: string): PipelineTemplate | undefined => {
  return pipelineTemplates.find(t => t.id === id);
};

export const searchTemplates = (query: string): PipelineTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return pipelineTemplates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.basketballContext.toLowerCase().includes(lowerQuery) ||
    t.biotechApplication.toLowerCase().includes(lowerQuery)
  );
};

export const getTemplateStats = () => {
  const totalSteps = pipelineTemplates.reduce((sum, t) => sum + t.steps.length, 0);
  const difficultyCounts = {
    beginner: pipelineTemplates.filter(t => t.difficulty === 'beginner').length,
    intermediate: pipelineTemplates.filter(t => t.difficulty === 'intermediate').length,
    advanced: pipelineTemplates.filter(t => t.difficulty === 'advanced').length
  };
  
  return {
    totalTemplates: pipelineTemplates.length,
    totalSteps,
    totalCategories: experimentCategories.length,
    difficultyCounts
  };
};
