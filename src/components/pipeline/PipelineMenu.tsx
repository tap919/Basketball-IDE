'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, ChevronRight, Play, Clock, Dna, Pill, ClipboardList, 
  Atom, Activity, Database, Target, Zap, Flame, Star, TrendingUp
} from 'lucide-react';
import { 
  experimentCategories, 
  pipelineTemplates, 
  getTemplatesByCategory,
  PipelineTemplate,
  ExperimentCategory 
} from '@/lib/pipeline/templates';

interface PipelineMenuProps {
  theme: string;
  onSelectTemplate: (template: PipelineTemplate) => void;
  selectedTemplateId?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Pill,
  ClipboardList,
  Dna,
  Atom,
  Activity,
  Database,
  Target
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600/20 text-green-400 border-green-600/50',
  intermediate: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50',
  advanced: 'bg-red-600/20 text-red-400 border-red-600/50'
};

export default function PipelineMenu({ theme, onSelectTemplate, selectedTemplateId }: PipelineMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExperimentCategory | 'all'>('all');

  const filteredTemplates = pipelineTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (iconName: string) => {
    return iconMap[iconName] || Dna;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter */}
      <div className="p-3 border-b border-[#30363d]">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            className="pl-9 h-9"
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Pills */}
        <ScrollArea className="whitespace-nowrap pb-2">
          <div className="flex gap-2">
            <Badge 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer ${selectedCategory === 'all' ? 'bg-emerald-600' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Badge>
            {experimentCategories.map(cat => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <Badge 
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedCategory === cat.id ? 'bg-emerald-600' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {cat.name}
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
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <CardDescription className="text-xs mt-0.5 line-clamp-1">
                          {template.description.slice(0, 50)}...
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex items-center gap-2 flex-wrap">
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
                    {template.difficulty === 'advanced' && (
                      <Flame className="w-3 h-3 text-orange-400" />
                    )}
                  </div>
                </CardContent>
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

      {/* Quick Stats */}
      <div className="p-3 border-t border-[#30363d]">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-[#161b22] rounded-lg">
            <div className="text-lg font-bold text-emerald-400">{pipelineTemplates.length}</div>
            <div className="text-xs text-gray-500">Templates</div>
          </div>
          <div className="p-2 bg-[#161b22] rounded-lg">
            <div className="text-lg font-bold text-blue-400">{experimentCategories.length}</div>
            <div className="text-xs text-gray-500">Categories</div>
          </div>
          <div className="p-2 bg-[#161b22] rounded-lg">
            <div className="text-lg font-bold text-purple-400">
              {pipelineTemplates.reduce((sum, t) => sum + t.steps.length, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Steps</div>
          </div>
        </div>
      </div>
    </div>
  );
}
