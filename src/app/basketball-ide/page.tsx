'use client';

import { useState, useEffect, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { 
  CircleDot, Dna, Database, Settings2, FileCode2, 
  ChevronDown, ChevronRight, Play, Search, Moon, Sun,
  BarChart3, Table, GitBranch, Terminal, BookOpen, Code2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import 'client-only';

// Dynamically import heavy components
const DataGrid = dynamic(() => import('@/components/basketball/DataGrid'), { ssr: false });
const StatsChart = dynamic(() => import('@/components/basketball/StatsChart'), { ssr: false });
const TranslationPanel = dynamic(() => import('@/components/basketball/TranslationPanel'), { ssr: false });
const LLMChatPanel = dynamic(() => import('@/components/ide/LLMChatPanel'), { ssr: false });
const ExtensionPanel = dynamic(() => import('@/components/ide/ExtensionPanel'), { ssr: false });
const CodeEditorPanel = dynamic(() => import('@/components/ide/CodeEditorPanel'), { ssr: false });
const SettingsPanel = dynamic(() => import('@/components/ide/SettingsPanel'), { ssr: false });

export default function CircleDotIDEPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState('data');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('2023-24');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['data', 'src']);
  
  // Sample seasons for dropdown
  const seasons = useMemo(() => {
    const years = [];
    for (let y = 2010; y <= 2024; y++) {
      years.push(`${y}-${(y + 1).toString().slice(2)}`);
    }
    return years;
  }, []);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const sidebarItems = [
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
    {
      id: 'src',
      label: 'Analysis Scripts',
      icon: FileCode2,
      children: [
        { id: 'team-analysis', label: 'team-analysis.ts' },
        { id: 'player-stats', label: 'player-stats.ts' },
        { id: 'biotech-convert', label: 'biotech-convert.ts' },
      ]
    },
  ];

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#0d1117] text-gray-200' : 'bg-white text-gray-900'}`}>
      {/* Top Bar */}
      <header className={`h-12 flex items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-[#30363d] bg-[#161b22]' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CircleDot className="w-6 h-6 text-orange-500" />
            <Dna className="w-5 h-5 text-emerald-500" />
          </div>
          <h1 className="text-lg font-semibold">
            CircleDot <span className="text-orange-500">→</span> Biotech IDE
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              className="pl-8 w-64 h-8 text-sm"
              placeholder="Search stats, teams, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className={`h-8 px-2 rounded text-sm ${theme === 'dark' ? 'bg-[#21262d] border-[#30363d]' : 'bg-white border-gray-200'} border`}
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            {seasons.map(s => (
              <option key={s} value={s}>{s} Season</option>
            ))}
          </select>
          
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
        <aside className={`w-64 border-r ${theme === 'dark' ? 'border-[#30363d] bg-[#0d1117]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="p-2">
            {sidebarItems.map(item => (
              <div key={item.id} className="mb-1">
                <button
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-[#21262d] ${theme === 'dark' ? 'hover:bg-[#21262d]' : 'hover:bg-gray-100'}`}
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
                  <div className="ml-4 pl-4 border-l border-[#30363d]">
                    {item.children.map(child => (
                      <button
                        key={child.id}
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm ${theme === 'dark' ? 'hover:bg-[#21262d]' : 'hover:bg-gray-100'}`}
                      >
                        {child.icon ? <child.icon className="w-3 h-3" /> : null}
                        <span className="text-gray-400">{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 px-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-[#161b22]' : 'bg-white'}`}>
                <div className="text-xs text-gray-500">Total Games</div>
                <div className="text-lg font-bold">24,847</div>
              </div>
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-[#161b22]' : 'bg-white'}`}>
                <div className="text-xs text-gray-500">Teams Tracked</div>
                <div className="text-lg font-bold">30</div>
              </div>
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-[#161b22]' : 'bg-white'}`}>
                <div className="text-xs text-gray-500">Biotech Analogies</div>
                <div className="text-lg font-bold">12</div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Panel */}
        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={55} minSize={30}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className={`flex items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <TabsList className="bg-transparent h-10">
                  <TabsTrigger value="data" className="data-[state=active]:bg-[#21262d]">
                    <Table className="w-4 h-4 mr-1" /> Data Grid
                  </TabsTrigger>
                  <TabsTrigger value="charts" className="data-[state=active]:bg-[#21262d]">
                    <BarChart3 className="w-4 h-4 mr-1" /> Charts
                  </TabsTrigger>
                  <TabsTrigger value="translation" className="data-[state=active]:bg-[#21262d]">
                    <Dna className="w-4 h-4 mr-1" /> Translation
                  </TabsTrigger>
                  <TabsTrigger value="code" className="data-[state=active]:bg-[#21262d]">
                    <Code2 className="w-4 h-4 mr-1" /> Code
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Season: {selectedSeason}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Play className="w-4 h-4 mr-1" /> Run Analysis
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="data" className="h-full m-0">
                  <DataGrid season={selectedSeason} theme={theme} />
                </TabsContent>
                <TabsContent value="charts" className="h-full m-0">
                  <StatsChart season={selectedSeason} theme={theme} />
                </TabsContent>
                <TabsContent value="translation" className="h-full m-0">
                  <TranslationPanel theme={theme} />
                </TabsContent>
                <TabsContent value="code" className="h-full m-0">
                  <CodeEditorPanel theme={theme} />
                </TabsContent>
              </div>
            </Tabs>
          </Panel>
          
          <PanelResizeHandle className={`w-1 ${theme === 'dark' ? 'bg-[#30363d] hover:bg-[#4a5568]' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`} />
          
          <Panel defaultSize={45} minSize={25}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={60}>
                <div className={`h-full flex flex-col border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                  <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span className="text-sm font-medium">LLM Assistant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">Ollama</Badge>
                      <Badge variant="outline" className="text-xs">Local</Badge>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <LLMChatPanel theme={theme} />
                  </div>
                </div>
              </Panel>
              
              <PanelResizeHandle className={`h-1 ${theme === 'dark' ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
              
              <Panel defaultSize={40}>
                <div className="h-full flex flex-col">
                  <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Config</Badge>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <SettingsPanel theme={theme} />
                  </div>
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
            Connected
          </span>
          <span>NBA Stats 2010-2024</span>
          <span>Biotech Translation v1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <span>TypeScript</span>
          <span>UTF-8</span>
          <span>Next.js 16</span>
        </div>
      </footer>
    </div>
  );
}
