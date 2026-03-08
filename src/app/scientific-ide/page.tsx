'use client';

import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { 
  CircleDot, Dna, Database, Settings2, FileCode2, 
  ChevronDown, ChevronRight, Search, Moon, Sun,
  BarChart3, Table, GitBranch, Terminal, BookOpen, Code2,
  Cpu, Server, Bug, TestTube, Layers, Eye, Zap, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import dynamic from 'next/dynamic';
import 'client-only';

// Scientific Components
const LanguageSupport = dynamic(() => import('@/components/scientific/LanguageSupport'), { ssr: false });
const NotebookPanel = dynamic(() => import('@/components/scientific/NotebookPanel'), { ssr: false });
const VisualizationPanel = dynamic(() => import('@/components/scientific/VisualizationPanel'), { ssr: false });
const VariableInspector = dynamic(() => import('@/components/scientific/VariableInspector'), { ssr: false });
const BuildPanel = dynamic(() => import('@/components/scientific/BuildPanel'), { ssr: false });
const DebuggerPanel = dynamic(() => import('@/components/scientific/DebuggerPanel'), { ssr: false });
const TestingPanel = dynamic(() => import('@/components/scientific/TestingPanel'), { ssr: false });
const RemotePanel = dynamic(() => import('@/components/scientific/RemotePanel'), { ssr: false });
const ProjectPanel = dynamic(() => import('@/components/scientific/ProjectPanel'), { ssr: false });

// Original Components
const DataGrid = dynamic(() => import('@/components/basketball/DataGrid'), { ssr: false });
const StatsChart = dynamic(() => import('@/components/basketball/StatsChart'), { ssr: false });
const TranslationPanel = dynamic(() => import('@/components/basketball/TranslationPanel'), { ssr: false });
const LLMChatPanel = dynamic(() => import('@/components/ide/LLMChatPanel'), { ssr: false });

export default function ScientificIDEPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState('notebook');
  const [rightTab, setRightTab] = useState('variables');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['scientific', 'data']);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const sidebarItems = [
    {
      id: 'scientific',
      label: 'Scientific Computing',
      icon: Cpu,
      children: [
        { id: 'languages', label: 'Languages', icon: Code2 },
        { id: 'notebook', label: 'Notebooks', icon: FileCode2 },
        { id: 'variables', label: 'Variables', icon: Eye },
        { id: 'plots', label: 'Plots', icon: BarChart3 },
      ]
    },
    {
      id: 'development',
      label: 'Development',
      icon: Zap,
      children: [
        { id: 'build', label: 'Build System', icon: Layers },
        { id: 'debug', label: 'Debugger', icon: Bug },
        { id: 'test', label: 'Testing', icon: TestTube },
      ]
    },
    {
      id: 'deployment',
      label: 'Deployment',
      icon: Server,
      children: [
        { id: 'remote', label: 'Remote/HPC', icon: Server },
        { id: 'project', label: 'Project', icon: Package },
      ]
    },
    {
      id: 'data',
      label: 'Data Sources',
      icon: Database,
      children: [
        { id: 'regular-season', label: 'Regular Season', icon: Table },
        { id: 'playoffs', label: 'Playoffs', icon: BarChart3 },
      ]
    },
    {
      id: 'translation',
      label: 'Translation Layer',
      icon: Dna,
      children: [
        { id: 'analogies', label: 'Biotech Analogies', icon: BookOpen },
        { id: 'mappings', label: 'Stat Mappings', icon: GitBranch },
      ]
    },
  ];

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#0d1117] text-gray-200' : 'bg-white text-gray-900'}`}>
      {/* Top Bar */}
      <header className={`h-12 flex items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-[#30363d] bg-[#161b22]' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-500" />
            <Dna className="w-5 h-5 text-emerald-500" />
          </div>
          <h1 className="text-lg font-semibold">
            Scientific <span className="text-purple-500">→</span> Biotech IDE
          </h1>
          <Badge variant="outline" className="text-xs">Multi-Language</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              className="pl-8 w-64 h-8 text-sm"
              placeholder="Search files, symbols, commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
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
        {/* Sidebar */}
        <aside className={`w-56 border-r flex flex-col ${theme === 'dark' ? 'border-[#30363d] bg-[#0d1117]' : 'border-gray-200 bg-gray-50'}`}>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {sidebarItems.map(item => (
                <div key={item.id} className="mb-1">
                  <button
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm ${theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-100'}`}
                    onClick={() => toggleFolder(item.id)}
                  >
                    {expandedFolders.includes(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                  
                  {expandedFolders.includes(item.id) && item.children && (
                    <div className={`ml-4 pl-4 border-l ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                      {item.children.map(child => (
                        <button
                          key={child.id}
                          className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm ${theme === 'dark' ? 'hover:bg-[#161b22] text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                          onClick={() => {
                            if (['notebook', 'languages', 'plots'].includes(child.id)) setActiveTab(child.id === 'languages' ? 'code' : child.id);
                            if (['variables', 'build', 'debug', 'test', 'remote', 'project'].includes(child.id)) setRightTab(child.id);
                          }}
                        >
                          {child.icon ? <child.icon className="w-3 h-3" /> : null}
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Quick Stats */}
          <div className={`p-2 border-t ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <div className={`p-2 rounded ${theme === 'dark' ? 'bg-[#161b22]' : 'bg-white'}`}>
              <div className="text-xs text-gray-500">Languages</div>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="outline" className="text-xs">Python</Badge>
                <Badge variant="outline" className="text-xs">R</Badge>
                <Badge variant="outline" className="text-xs">Julia</Badge>
                <Badge variant="outline" className="text-xs">C++</Badge>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Panel */}
        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={50} minSize={30}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className={`flex items-center justify-between px-3 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <TabsList className="bg-transparent h-9">
                  <TabsTrigger value="notebook" className="data-[state=active]:bg-[#21262d] text-xs px-3">
                    <FileCode2 className="w-3 h-3 mr-1" /> Notebook
                  </TabsTrigger>
                  <TabsTrigger value="code" className="data-[state=active]:bg-[#21262d] text-xs px-3">
                    <Code2 className="w-3 h-3 mr-1" /> Languages
                  </TabsTrigger>
                  <TabsTrigger value="plots" className="data-[state=active]:bg-[#21262d] text-xs px-3">
                    <BarChart3 className="w-3 h-3 mr-1" /> Plots
                  </TabsTrigger>
                  <TabsTrigger value="data" className="data-[state=active]:bg-[#21262d] text-xs px-3">
                    <Table className="w-3 h-3 mr-1" /> Data
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="notebook" className="h-full m-0">
                  <NotebookPanel theme={theme} />
                </TabsContent>
                <TabsContent value="code" className="h-full m-0">
                  <LanguageSupport theme={theme} />
                </TabsContent>
                <TabsContent value="plots" className="h-full m-0">
                  <VisualizationPanel theme={theme} />
                </TabsContent>
                <TabsContent value="data" className="h-full m-0">
                  <DataGrid season="2023-24" theme={theme} />
                </TabsContent>
              </div>
            </Tabs>
          </Panel>
          
          <PanelResizeHandle className={`w-1 ${theme === 'dark' ? 'bg-[#30363d] hover:bg-[#4a5568]' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`} />
          
          <Panel defaultSize={50} minSize={25}>
            <Tabs value={rightTab} onValueChange={setRightTab} className="h-full flex flex-col">
              <div className={`flex items-center px-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <TabsList className="bg-transparent h-9">
                  <TabsTrigger value="variables" className="data-[state=active]:bg-[#21262d] text-xs px-2">
                    <Eye className="w-3 h-3 mr-1" /> Variables
                  </TabsTrigger>
                  <TabsTrigger value="debug" className="data-[state=active]:bg-[#21262d] text-xs px-2">
                    <Bug className="w-3 h-3 mr-1" /> Debug
                  </TabsTrigger>
                  <TabsTrigger value="build" className="data-[state=active]:bg-[#21262d] text-xs px-2">
                    <Layers className="w-3 h-3 mr-1" /> Build
                  </TabsTrigger>
                  <TabsTrigger value="test" className="data-[state=active]:bg-[#21262d] text-xs px-2">
                    <TestTube className="w-3 h-3 mr-1" /> Test
                  </TabsTrigger>
                  <TabsTrigger value="remote" className="data-[state=active]:bg-[#21262d] text-xs px-2">
                    <Server className="w-3 h-3 mr-1" /> Remote
                  </TabsTrigger>
                  <TabsTrigger value="project" className="data-[state=active]:bg-[#21262d] text-xs px-2">
                    <Package className="w-3 h-3 mr-1" /> Project
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="variables" className="h-full m-0">
                  <VariableInspector theme={theme} />
                </TabsContent>
                <TabsContent value="debug" className="h-full m-0">
                  <DebuggerPanel theme={theme} />
                </TabsContent>
                <TabsContent value="build" className="h-full m-0">
                  <BuildPanel theme={theme} />
                </TabsContent>
                <TabsContent value="test" className="h-full m-0">
                  <TestingPanel theme={theme} />
                </TabsContent>
                <TabsContent value="remote" className="h-full m-0">
                  <RemotePanel theme={theme} />
                </TabsContent>
                <TabsContent value="project" className="h-full m-0">
                  <ProjectPanel theme={theme} />
                </TabsContent>
              </div>
            </Tabs>
          </Panel>
        </PanelGroup>
      </div>
      
      {/* Status Bar */}
      <footer className={`h-6 flex items-center justify-between px-4 text-xs ${theme === 'dark' ? 'bg-[#161b22] border-t border-[#30363d]' : 'bg-gray-50 border-t border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Python 3.11 | Julia 1.9 | R 4.3
          </span>
          <span>Kernel: Ready</span>
        </div>
        <div className="flex items-center gap-4">
          <span>GPU: Available</span>
          <span>Memory: 8.5GB / 16GB</span>
        </div>
      </footer>
    </div>
  );
}
