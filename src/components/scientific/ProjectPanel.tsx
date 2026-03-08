'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Package, GitBranch, FileText, RefreshCw, Plus, Trash2, Download,
  Check, AlertCircle, Link, ExternalLink, Shield, Database
} from 'lucide-react';

interface ProjectPanelProps {
  theme: string;
}

interface Dependency {
  name: string;
  version: string;
  latest?: string;
  source: 'pip' | 'conda' | 'npm';
  status: 'installed' | 'outdated' | 'missing';
}

const sampleDependencies: Dependency[] = [
  { name: 'numpy', version: '1.26.4', latest: '1.26.4', source: 'pip', status: 'installed' },
  { name: 'pandas', version: '2.1.4', latest: '2.2.0', source: 'pip', status: 'outdated' },
  { name: 'scipy', version: '1.12.0', latest: '1.12.0', source: 'pip', status: 'installed' },
  { name: 'matplotlib', version: '3.8.2', source: 'pip', status: 'installed' },
  { name: 'scikit-learn', version: '1.4.0', source: 'pip', status: 'installed' },
  { name: 'torch', version: '2.2.0', latest: '2.2.1', source: 'pip', status: 'outdated' },
  { name: 'r-base', version: '4.3.2', source: 'conda', status: 'installed' },
  { name: 'julia', version: '1.10.0', source: 'conda', status: 'installed' }
];

const reproducibilityChecklist = [
  { id: 'requirements', label: 'requirements.txt exists', checked: true },
  { id: 'environment', label: 'environment.yml exists', checked: true },
  { id: 'readme', label: 'README with setup instructions', checked: true },
  { id: 'gitignore', label: '.gitignore configured', checked: true },
  { id: 'license', label: 'LICENSE file present', checked: false },
  { id: 'random_seed', label: 'Random seed documented', checked: false },
  { id: 'data_source', label: 'Data sources documented', checked: true },
  { id: 'version_control', label: 'All code in version control', checked: true }
];

export default function ProjectPanel({ theme }: ProjectPanelProps) {
  const [dependencies] = useState(sampleDependencies);
  const [checklist, setChecklist] = useState(reproducibilityChecklist);
  const [envFile, setEnvFile] = useState(`name: basketball-biotech
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.11
  - numpy=1.26.4
  - pandas=2.1.4
  - scipy=1.12.0
  - matplotlib=3.8.2
  - pip:
    - scikit-learn==1.4.0
    - torch==2.2.0
    - z-ai-web-dev-sdk`);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const stats = {
    total: dependencies.length,
    installed: dependencies.filter(d => d.status === 'installed').length,
    outdated: dependencies.filter(d => d.status === 'outdated').length,
    checked: checklist.filter(c => c.checked).length
  };

  return (
    <div className="h-full flex">
      {/* Dependencies */}
      <div className={`w-80 border-r flex flex-col ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className={`px-3 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">Dependencies</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="flex gap-4 text-xs">
            <span className="text-green-500">{stats.installed} installed</span>
            <span className="text-yellow-500">{stats.outdated} updates</span>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {dependencies.map(dep => (
              <div
                key={dep.name}
                className={`flex items-center justify-between px-2 py-1.5 rounded text-sm ${
                  theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {dep.status === 'installed' ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : dep.status === 'outdated' ? (
                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className="font-mono">{dep.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{dep.version}</Badge>
                  {dep.latest && dep.latest !== dep.version && (
                    <span className="text-xs text-yellow-500">→ {dep.latest}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Actions */}
        <div className={`p-2 border-t space-y-2 ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <Button variant="outline" className="w-full h-8 text-sm">
            <Download className="w-4 h-4 mr-2" />
            Update All
          </Button>
          <Button variant="outline" className="w-full h-8 text-sm">
            <FileText className="w-4 h-4 mr-2" />
            Export requirements.txt
          </Button>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="flex-1 flex flex-col">
        {/* Environment File */}
        <div className={`border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">environment.yml</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
          <Textarea
            value={envFile}
            onChange={(e) => setEnvFile(e.target.value)}
            className={`min-h-[150px] font-mono text-xs border-0 rounded-none ${
              theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gray-50'
            }`}
          />
        </div>
        
        {/* Reproducibility Checklist */}
        <div className="flex-1">
          <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Reproducibility Checklist</span>
              </div>
              <Badge variant="outline" className={`text-xs ${
                stats.checked >= 6 ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'
              }`}>
                {stats.checked}/{checklist.length}
              </Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {checklist.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-2 rounded ${
                    theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Switch
                    checked={item.checked}
                    onCheckedChange={() => toggleCheck(item.id)}
                  />
                  <span className={`text-sm ${!item.checked && 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  {item.checked && <Check className="w-4 h-4 text-green-500 ml-auto" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Git Status */}
        <div className={`px-3 py-2 border-t ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <GitBranch className="w-4 h-4" />
              <span className="font-mono">main</span>
              <Badge variant="outline" className="text-xs">2 commits ahead</Badge>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              Push
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
