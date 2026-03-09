'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles, Lightbulb, Zap, Target, TrendingUp, Clock,
  Brain, Dna, Heart, Bug, ChevronRight, RefreshCw,
  Star, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';
import { generatedHypotheses, ResearchHypothesis } from '@/lib/pipeline/hypothesis-engine';

export default function AIDiscoveryPanel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedHypothesis, setSelectedHypothesis] = useState<ResearchHypothesis | null>(null);
  const [discoveries, setDiscoveries] = useState<ResearchHypothesis[]>(generatedHypotheses);

  const runDeepAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'breakthrough': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'high': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50';
      case 'medium': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'breakthrough': return <Star className="w-3 h-3" />;
      case 'high': return <Target className="w-3 h-3" />;
      case 'medium': return <TrendingUp className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      {/* Header */}
      <div className="p-3 border-b border-[#30363d]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="font-medium">AI Discovery Engine</h3>
            <Badge className="bg-purple-600 animate-pulse">Advanced AI</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={runDeepAnalysis} disabled={isAnalyzing}>
            <RefreshCw className={`w-3 h-3 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Deep Analysis
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          AI-generated research hypotheses based on basketball-to-biotech translation patterns
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Hypothesis List */}
        <ScrollArea className="w-80 border-r border-[#30363d]">
          <div className="p-2 space-y-2">
            {discoveries.map(hypothesis => (
              <Card 
                key={hypothesis.id}
                className={`cursor-pointer transition-all ${
                  selectedHypothesis?.id === hypothesis.id 
                    ? 'bg-purple-600/20 border-purple-500' 
                    : 'bg-[#161b22] border-[#30363d] hover:border-[#4a5568]'
                }`}
                onClick={() => setSelectedHypothesis(hypothesis)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getImpactColor(hypothesis.potentialImpact)}>
                      {getImpactIcon(hypothesis.potentialImpact)}
                      <span className="ml-1 capitalize">{hypothesis.potentialImpact}</span>
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                  
                  <h4 className="text-sm font-medium line-clamp-2">{hypothesis.title}</h4>
                  
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {hypothesis.feasibility}% feasible
                    </span>
                    <span className="flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      {hypothesis.noveltyScore}% novel
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Hypothesis Detail */}
        {selectedHypothesis ? (
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Title & Badges */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getImpactColor(selectedHypothesis.potentialImpact)}>
                    {selectedHypothesis.potentialImpact} Impact
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Novelty: {selectedHypothesis.noveltyScore}%
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Feasibility: {selectedHypothesis.feasibility}%
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold">{selectedHypothesis.title}</h2>
              </div>

              {/* Summary */}
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">{selectedHypothesis.summary}</p>
                </CardContent>
              </Card>

              {/* Basketball Analogy */}
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-orange-400">
                    🏀 Basketball Analogy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">{selectedHypothesis.basketballAnalogy}</p>
                </CardContent>
              </Card>

              {/* Scientific Rationale */}
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    Scientific Rationale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedHypothesis.scientificRationale}</p>
                </CardContent>
              </Card>

              {/* Required Experiments */}
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    Required Experiments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedHypothesis.requiredExperiments.map((exp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        {exp}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Timeline & References */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="text-gray-400">Timeline:</span>
                      <span className="font-medium">{selectedHypothesis.estimatedTimeline}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-gray-400">Status:</span>
                      <span className="font-medium capitalize">{selectedHypothesis.status}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* References */}
              <Card className="bg-[#161b22] border-[#30363d]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Key References</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {selectedHypothesis.keyReferences.map((ref, i) => (
                      <li key={i} className="text-xs text-gray-400">• {ref}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Research Project
                </Button>
                <Button variant="outline">
                  Save for Later
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
              <p className="text-gray-500">Select a hypothesis to explore</p>
              <p className="text-xs text-gray-600 mt-1">AI-generated research opportunities</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
