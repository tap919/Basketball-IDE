'use client';

import { useState } from 'react';
import { PipelineTemplate, PipelineResult } from '@/lib/pipeline/types';
import PipelineMenu from './PipelineMenu';
import PipelineRunner from './PipelineRunner';

interface PipelinePanelProps {
  theme: string;
}

export default function PipelinePanel({ theme }: PipelinePanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PipelineTemplate | null>(null);
  const [lastResult, setLastResult] = useState<PipelineResult | null>(null);

  const handleSelectTemplate = (template: PipelineTemplate) => {
    setSelectedTemplate(template);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  const handlePipelineComplete = (result: PipelineResult) => {
    setLastResult(result);
    console.log('Pipeline completed:', result);
  };

  return (
    <div className="h-full flex">
      {selectedTemplate ? (
        <PipelineRunner 
          theme={theme} 
          template={selectedTemplate}
          onBack={handleBack}
          onPipelineComplete={handlePipelineComplete}
        />
      ) : (
        <PipelineMenu 
          theme={theme}
          onSelectTemplate={handleSelectTemplate}
          selectedTemplateId={selectedTemplate?.id}
        />
      )}
    </div>
  );
}
