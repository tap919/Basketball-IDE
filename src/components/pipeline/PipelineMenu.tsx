'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, ChevronRight, Play, Clock, Dna, Pill, ClipboardList, 
  Atom, Activity, Database, Target, Zap, Flame, Star, TrendingUp,
  Heart, Bug, Brain, Sparkles, AlertCircle, Award, Rocket
} from 'lucide-react';
import { 
  experimentCategories, 
  pipelineTemplates, 
  getTemplatesByCategory,
  getBreakthroughPotential,
  PipelineTemplate,
  ExperimentCategory 
} from '@/lib/pipeline/templates';

interface PipelineMenuProps {
  theme: string;
  onSelectTemplate: (template: PipelineTemplate) => void;
  selectedTemplateId?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Bug,
  Dna,
  Atom,
  Activity,
  Database,
  Target,
  Brain,
  Sparkles,
  Pill,
  ClipboardList
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600/20 text-green-400 border-green-600/50',
  intermediate: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50',
  advanced: 'bg-red-600/20 text-red-400 border-red-600/50'
};

const categoryColors: Record<string, string> = {
  'disease-cure': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
  'virus-mutation': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  'gene-therapy': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  'physiology-modeling': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'cancer-research': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  'neurodegenerative': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
  'rare-disease': 'bg-violet-500/20 text-violet-400 border-violet-500/50'
};

export default function PipelineMenu({ theme, onSelectTemplate, selectedTemplateId }: PipelineMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExperimentCategory | 'all'>('all');
  const [showBreakthroughs, setShowBreakthroughs] = useState(true);

  const filteredTemplates = pipelineTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.biotechApplication.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (iconName: string) => {
    return iconMap[iconName] || Dna;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Breakthrough Toggle */}
      <div className="p-3 border-b border-[#30363d]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Rocket className="w-5 h-5 text-emerald-400" />
            Experiment Pipelines
          </h2>
          <Button 
            variant={showBreakthroughs ? 'default' : 'outline'}
            size="sm"
            className={showBreakthroughs ? 'bg-emerald-600' : ''}
            onClick={() => setShowBreakthroughs(!showBreakthroughs)}
          >
            <Star className="w-3 h-3 mr-1" />
            Breakthroughs
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            className="pl-9 h-9"
            placeholder="Search experiments, diseases, cures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Pills */}
        <ScrollArea className="whitespace-nowrap pb-2">
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer ${selectedCategory === 'all' ? 'bg-emerald-600' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All ({pipelineTemplates.length})
            </Badge>
            {experimentCategories.map(cat => {
              const Icon = getCategoryIcon(cat.icon);
              const count = getTemplatesByCategory(cat.id).length;
              return (
                <Badge 
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedCategory === cat.id ? 'bg-emerald-600' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {cat.name} ({count})
                </Badge>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Template List */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {filteredTemplates.map(template => {
            const category = experimentCategories.find(c => c.id === template.category);
            const CategoryIcon = category ? getCategoryIcon(category.icon) : Dna;
            const isSelected = selectedTemplateId === template.id;
            const breakthrough = getBreakthroughPotential(template.id);
            
            return (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:border-emerald-500/50 ${
                  isSelected ? 'border-emerald-500 bg-emerald-500/10' : 'bg-[#161b22] border-[#30363d]'
                }`}
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600/20' : 'bg-[#21262d]'}`}>
                        <CategoryIcon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-sm flex items-center gap-2">
                          {template.name}
                          {template.difficulty === 'advanced' && (
                            <Flame className="w-3 h-3 text-orange-400" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5 line-clamp-2">
                          {template.description.slice(0, 80)}...
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />
                  </div>
                </CardHeader>
                
                {/* Breakthrough Section */}
                {showBreakthroughs && (
                  <CardContent className="p-3 pt-0 pb-2">
                    <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/30">
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium mb-1">
                        <Award className="w-3 h-3" />
                        Breakthrough Potential
                      </div>
                      <p className="text-xs text-gray-300">{breakthrough.breakthrough}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-2 h-2" />
                          {breakthrough.impact.split(' ').slice(0, 5).join(' ')}...
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2 h-2" />
                          {breakthrough.timeline}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                )}
                
                <CardFooter className="p-3 pt-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-xs ${categoryColors[template.category] || ''}`}>
                      {category?.name}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${difficultyColors[template.difficulty]}`}>
                      {template.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {template.estimatedDuration}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {template.steps.length} steps
                    </Badge>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No experiments found</p>
              <p className="text-xs">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Stats Footer */}
      <div className="p-3 border-t border-[#30363d]">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-[#161b22] rounded-lg">
            <div className="text-lg font-bold text-emerald-400">{pipelineTemplates.length}</div>
            <div className="text-[10px] text-gray-500">Pipelines</div>
          </div>
          <div className="p-2 bg-[#161b22] rounded-lg">
            <div className="text-lg font-bold text-pink-400">7</div>
            <div className="text-[10px] text-gray-500">Categories</div>
          </div>
          <div className="p-2 bg-[#161b22] rounded-lg">
            <div className="text-lg font-bold text-purple-400">
              {pipelineTemplates.reduce((sum, t) => sum + t.steps.length, 0)}
            </div>
            <div className="text-[10px] text-gray-500">Steps</div>
          </div>
          <div className="p-2 bg-[#161b22] rounded-lg">
            <div className="text-lg font-bold text-orange-400">11</div>
            <div className="text-[10px] text-gray-500">Breakthroughs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
