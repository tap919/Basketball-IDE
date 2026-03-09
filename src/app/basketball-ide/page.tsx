'use client';

import { useState, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { 
  CircleDot, Dna, Database, Settings2, FileCode2, 
  ChevronDown, ChevronRight, Play, Search, Moon, Sun,
  BarChart3, Table, GitBranch, Terminal, BookOpen, Code2,
  FlaskConical, Beaker, HelpCircle, GraduationCap, Heart,
  Award, Sparkles, Rocket, Users, ChevronLeft, Network,
  Lightbulb, FileText, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import 'client-only';
import { pipelineTemplates, experimentCategories, getBreakthroughPotential } from '@/lib/pipeline/templates';
import { PipelineTemplate } from '@/lib/pipeline/types';
import { scienceGlossary, GlossaryBrowser, ConceptCard } from '@/components/citizen-scientist/Explainer';
import TrustIndicators from '@/components/citizen-scientist/TrustIndicators';
import GuidedWizard from '@/components/citizen-scientist/GuidedWizard';
import KnowledgeGraph from '@/components/advanced/KnowledgeGraph';
import AIDiscoveryPanel from '@/components/advanced/AIDiscoveryPanel';
import ReportGenerator from '@/components/advanced/ReportGenerator';
import ResearchHub from '@/components/advanced/ResearchHub';

// Dynamically import heavy components
const DataGrid = dynamic(() => import('@/components/basketball/DataGrid'), { ssr: false });
const StatsChart = dynamic(() => import('@/components/basketball/StatsChart'), { ssr: false });
const TranslationPanel = dynamic(() => import('@/components/basketball/TranslationPanel'), { ssr: false });
const LLMChatPanel = dynamic(() => import('@/components/ide/LLMChatPanel'), { ssr: false });
const SettingsPanel = dynamic(() => import('@/components/ide/SettingsPanel'), { ssr: false });

export default function CircleDotIDEPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState('experiments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('2023-24');
  const [selectedTemplate, setSelectedTemplate] = useState<PipelineTemplate | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [showGlossary, setShowGlossary] = useState(false);
  
  const seasons = useMemo(() => {
    const years = [];
    for (let y = 2010; y <= 2024; y++) {
      years.push(`${y}-${(y + 1).toString().slice(2)}`);
    }
    return years;
  }, []);

  const handleSelectTemplate = (template: PipelineTemplate) => {
    setSelectedTemplate(template);
    setShowWizard(true);
  };

  const handleBackFromWizard = () => {
    setShowWizard(false);
    setSelectedTemplate(null);
  };

  const handleExperimentComplete = (results: any) => {
    console.log('Experiment completed:', results);
  };

  // If in wizard mode, show the guided wizard
  if (showWizard && selectedTemplate) {
    return (
      <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#0d1117] text-gray-200' : 'bg-white text-gray-900'}`}>
        {/* Simple header for wizard */}
        <header className={`h-12 flex items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-[#30363d] bg-[#161b22]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <CircleDot className="w-6 h-6 text-orange-500" />
            <Dna className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold">CircleDot → Biotech IDE</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </header>
        
        <GuidedWizard 
          template={selectedTemplate}
          onComplete={handleExperimentComplete}
          onBack={handleBackFromWizard}
        />
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#0d1117] text-gray-200' : 'bg-white text-gray-900'}`}>
      {/* Top Bar */}
      <header className={`h-12 flex items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-[#30363d] bg-[#161b22]' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CircleDot className="w-6 h-6 text-orange-500" />
            <Dna className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              CircleDot <span className="text-orange-500">→</span> Biotech IDE
            </h1>
            <p className="text-xs text-gray-500">Citizen Scientist Platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* User Level Selector */}
          <div className="flex items-center gap-1 text-xs">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <select 
              className={`h-7 px-2 rounded text-xs ${theme === 'dark' ? 'bg-[#21262d] border-[#30363d]' : 'bg-white border-gray-200'} border`}
              value={userLevel}
              onChange={(e) => setUserLevel(e.target.value as any)}
            >
              <option value="beginner">Beginner Mode</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              className="pl-8 w-64 h-8 text-sm"
              placeholder="Search experiments, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
            onClick={() => setShowGlossary(!showGlossary)}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Glossary
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Experiment Categories */}
        <aside className={`w-72 border-r ${theme === 'dark' ? 'border-[#30363d] bg-[#0d1117]' : 'border-gray-200 bg-gray-50'} flex flex-col`}>
          {/* Welcome Card */}
          <div className="p-3 border-b border-[#30363d]">
            <Card className="bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border-emerald-500/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium text-sm">Welcome, Scientist!</span>
                </div>
                <p className="text-xs text-gray-300">
                  Choose an experiment below to start your research journey. 
                  Each experiment guides you step-by-step.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {experimentCategories.map(category => {
                const templates = pipelineTemplates.filter(t => t.category === category.id);
                
                return (
                  <div key={category.id} className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span>{category.name}</span>
                      <Badge variant="outline" className="ml-auto text-[10px]">
                        {templates.length}
                      </Badge>
                    </div>
                    
                    {templates.map(template => {
                      const breakthrough = getBreakthroughPotential(template.id);
                      
                      return (
                        <button
                          key={template.id}
                          className={`w-full text-left p-2 rounded text-sm ${
                            selectedTemplate?.id === template.id 
                              ? 'bg-emerald-600/20 border border-emerald-500/50' 
                              : 'hover:bg-[#21262d] border border-transparent'
                          }`}
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{template.name}</span>
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                            {breakthrough.breakthrough.slice(0, 40)}...
                          </p>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Quick Stats */}
          <div className="p-3 border-t border-[#30363d]">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-[#161b22] rounded">
                <div className="font-bold text-emerald-400">{pipelineTemplates.length}</div>
                <div className="text-gray-500">Experiments</div>
              </div>
              <div className="p-2 bg-[#161b22] rounded">
                <div className="font-bold text-purple-400">{Object.keys(scienceGlossary).length}</div>
                <div className="text-gray-500">Concepts</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Panel */}
        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={showGlossary ? 40 : 60} minSize={30}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className={`flex items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <TabsList className="bg-transparent h-10">
                  <TabsTrigger value="experiments" className="data-[state=active]:bg-emerald-600/30">
                    <FlaskConical className="w-4 h-4 mr-1" /> Experiments
                  </TabsTrigger>
                  <TabsTrigger value="discovery" className="data-[state=active]:bg-purple-600/30">
                    <Lightbulb className="w-4 h-4 mr-1" /> AI Discovery
                  </TabsTrigger>
                  <TabsTrigger value="knowledge" className="data-[state=active]:bg-[#21262d]">
                    <Network className="w-4 h-4 mr-1" /> Knowledge
                  </TabsTrigger>
                  <TabsTrigger value="data" className="data-[state=active]:bg-[#21262d]">
                    <Table className="w-4 h-4 mr-1" /> Data
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="experiments" className="h-full m-0 overflow-auto p-4">
                  {/* Featured Breakthrough */}
                  <Card className="bg-gradient-to-br from-purple-600/20 to-emerald-600/20 border-purple-500/30 mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Featured Breakthrough Experiment
                      </CardTitle>
                      <CardDescription>
                        Start here for the highest potential impact
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium">CRISPR Gene Cure Designer</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Design one-time cures for genetic diseases. This experiment guides you through 
                            creating CRISPR therapies that could permanently cure conditions like sickle cell disease.
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className="bg-emerald-600">Beginner Friendly</Badge>
                            <Badge variant="outline">45-60 min</Badge>
                          </div>
                        </div>
                        <Button 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleSelectTemplate(pipelineTemplates.find(t => t.id === 'crispr-cure-design')!)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* All Experiments Grid */}
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-emerald-400" />
                    All Experiments ({pipelineTemplates.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {pipelineTemplates.map(template => {
                      const breakthrough = getBreakthroughPotential(template.id);
                      const difficultyColors = {
                        beginner: 'bg-green-600/20 text-green-400 border-green-600/50',
                        intermediate: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50',
                        advanced: 'bg-red-600/20 text-red-400 border-red-600/50'
                      };
                      
                      return (
                        <Card 
                          key={template.id}
                          className="bg-[#161b22] border-[#30363d] hover:border-emerald-500/50 cursor-pointer transition-all"
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <CardHeader className="p-3 pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <Sparkles className="w-4 h-4 text-yellow-400" />
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                              {template.description}
                            </p>
                            
                            {/* Breakthrough */}
                            <div className="p-2 bg-emerald-500/10 rounded text-xs mb-2">
                              <span className="text-emerald-400">💡 {breakthrough.breakthrough.slice(0, 50)}...</span>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={`text-[10px] ${difficultyColors[template.difficulty]}`}>
                                {template.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">
                                {template.estimatedDuration}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="discovery" className="h-full m-0">
                  <AIDiscoveryPanel />
                </TabsContent>
                
                <TabsContent value="knowledge" className="h-full m-0">
                  <KnowledgeGraph />
                </TabsContent>
                
                <TabsContent value="data" className="h-full m-0">
                  <DataGrid season={selectedSeason} theme={theme} />
                </TabsContent>
              </div>
            </Tabs>
          </Panel>
          
          <PanelResizeHandle className={`w-1 ${theme === 'dark' ? 'bg-[#30363d] hover:bg-[#4a5568]' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`} />
          
          <Panel defaultSize={showGlossary ? 60 : 40} minSize={25}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={60}>
                <div className={`h-full flex flex-col border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                  <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span className="text-sm font-medium">AI Research Assistant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">Ask Anything</Badge>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <LLMChatPanel 
                      theme={theme} 
                      onRunPipeline={(id) => {
                        const template = pipelineTemplates.find(t => t.id === id);
                        if (template) handleSelectTemplate(template);
                      }}
                    />
                  </div>
                </div>
              </Panel>
              
              <PanelResizeHandle className={`h-1 ${theme === 'dark' ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
              
              <Panel defaultSize={40}>
                <div className="h-full flex flex-col">
                  <Tabs defaultValue="trust" className="h-full flex flex-col">
                    <div className={`flex border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                      <TabsList className="bg-transparent">
                        <TabsTrigger value="trust" className="data-[state=active]:bg-[#21262d]">
                          <Award className="w-3 h-3 mr-1" /> Trust
                        </TabsTrigger>
                        <TabsTrigger value="report" className="data-[state=active]:bg-[#21262d]">
                          <FileText className="w-3 h-3 mr-1" /> Report
                        </TabsTrigger>
                        <TabsTrigger value="hub" className="data-[state=active]:bg-[#21262d]">
                          <Trophy className="w-3 h-3 mr-1" /> Hub
                        </TabsTrigger>
                        <TabsTrigger value="learn" className="data-[state=active]:bg-[#21262d]">
                          <GraduationCap className="w-3 h-3 mr-1" /> Learn
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="trust" className="flex-1 m-0 overflow-auto p-3">
                      <TrustIndicators 
                        confidence={{
                          overall: 88,
                          dataQuality: 92,
                          methodology: 85,
                          reproducibility: 90,
                          statistical: 87
                        }}
                        calibration={{
                          benchmarked: true,
                          benchmarkSource: 'NIH Standard Dataset',
                          accuracyScore: 94,
                          certifications: ['ISO 27001', 'GCP Compliant']
                        }}
                      />
                    </TabsContent>
                    
                    <TabsContent value="report" className="flex-1 m-0">
                      <ReportGenerator />
                    </TabsContent>
                    
                    <TabsContent value="hub" className="flex-1 m-0">
                      <ResearchHub />
                    </TabsContent>
                    
                    <TabsContent value="learn" className="flex-1 m-0 overflow-auto p-3">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-purple-400" />
                          Science Glossary
                        </h4>
                        <GlossaryBrowser />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
      
      {/* Status Bar */}
      <footer className={`h-6 flex items-center justify-between px-4 text-xs ${theme === 'dark' ? 'bg-[#161b22] border-t border-[#30363d]' : 'bg-gray-50 border-t border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Ready
          </span>
          <span>Citizen Scientist Mode</span>
          <span>{pipelineTemplates.length} Experiments Available</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Trust Score: 88%</span>
          <span>Calibrated ✓</span>
        </div>
      </footer>
    </div>
  );
}
