'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Puzzle, Settings, Trash2, Download, ExternalLink,
  ChevronDown, ChevronRight, Package, Zap, Shield,
  BarChart2, FileText, RefreshCw
} from 'lucide-react';

interface ExtensionPanelProps {
  theme: string;
}

interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  category: 'analysis' | 'visualization' | 'integration' | 'ai';
  icon: React.ReactNode;
}

const defaultExtensions: Extension[] = [
  {
    id: 'biotech-analyzer',
    name: 'Biotech Analyzer',
    description: 'Advanced statistical analysis for biotech translations',
    version: '1.2.0',
    author: 'Basketball-Biotech Labs',
    enabled: true,
    category: 'analysis',
    icon: <BarChart2 className="w-4 h-4" />
  },
  {
    id: 'chart-generator',
    name: 'Chart Generator',
    description: 'Generate publication-ready charts from NBA stats',
    version: '2.0.1',
    author: 'DataViz Inc',
    enabled: true,
    category: 'visualization',
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: 'ollama-integration',
    name: 'Ollama Integration',
    description: 'Connect to local Ollama LLM models',
    version: '0.9.5',
    author: 'Open Source Community',
    enabled: true,
    category: 'ai',
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'pubmed-linker',
    name: 'PubMed Linker',
    description: 'Link biotech concepts to PubMed research',
    version: '1.0.0',
    author: 'Research Tools Co',
    enabled: false,
    category: 'integration',
    icon: <ExternalLink className="w-4 h-4" />
  },
  {
    id: 'data-validator',
    name: 'Data Validator',
    description: 'Validate NBA stats data integrity',
    version: '1.1.0',
    author: 'Data Quality Labs',
    enabled: false,
    category: 'analysis',
    icon: <Shield className="w-4 h-4" />
  }
];

const availableExtensions: Extension[] = [
  {
    id: 'molecular-viewer',
    name: 'Molecular Viewer',
    description: '3D visualization of molecular structures',
    version: '3.0.0',
    author: 'BioMolecular Tools',
    enabled: false,
    category: 'visualization',
    icon: <Package className="w-4 h-4" />
  },
  {
    id: 'clinical-trials',
    name: 'Clinical Trials Database',
    description: 'Search clinicaltrials.gov for related studies',
    version: '1.0.0',
    author: 'Clinical Data Systems',
    enabled: false,
    category: 'integration',
    icon: <ExternalLink className="w-4 h-4" />
  }
];

export default function ExtensionPanel({ theme }: ExtensionPanelProps) {
  const [installed, setInstalled] = useState<Extension[]>(defaultExtensions);
  const [available, setAvailable] = useState<Extension[]>(availableExtensions);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('analysis');

  const toggleExtension = (id: string) => {
    setInstalled(prev => 
      prev.map(ext => 
        ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
      )
    );
  };

  const installExtension = (ext: Extension) => {
    setInstalled(prev => [...prev, { ...ext, enabled: true }]);
    setAvailable(prev => prev.filter(e => e.id !== ext.id));
  };

  const uninstallExtension = (id: string) => {
    const ext = installed.find(e => e.id === id);
    if (ext) {
      setInstalled(prev => prev.filter(e => e.id !== id));
      setAvailable(prev => [...prev, { ...ext, enabled: false }]);
    }
  };

  const categories = [
    { id: 'analysis', name: 'Analysis', icon: BarChart2 },
    { id: 'visualization', name: 'Visualization', icon: FileText },
    { id: 'integration', name: 'Integrations', icon: ExternalLink },
    { id: 'ai', name: 'AI & ML', icon: Zap }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-[#30363d] flex items-center justify-between">
        <span className="text-sm font-medium">Extension Manager</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <RefreshCw className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Download className="w-3 h-3 mr-1" /> Update All
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Installed Extensions */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Installed ({installed.filter(e => e.enabled).length} active)
            </h4>
            
            {categories.map(category => {
              const exts = installed.filter(e => e.category === category.id);
              if (exts.length === 0) return null;
              
              return (
                <div key={category.id} className="mb-3">
                  <button
                    className="flex items-center gap-1 text-sm font-medium w-full"
                    onClick={() => setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )}
                  >
                    {expandedCategory === category.id ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    <category.icon className="w-3 h-3" />
                    {category.name}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {exts.length}
                    </Badge>
                  </button>
                  
                  {expandedCategory === category.id && (
                    <div className="mt-2 space-y-2 pl-4">
                      {exts.map(ext => (
                        <Card key={ext.id} className="bg-[#161b22] border-[#30363d]">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {ext.icon}
                                  <span className="text-sm font-medium">{ext.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {ext.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    v{ext.version}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    by {ext.author}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={ext.enabled}
                                  onCheckedChange={() => toggleExtension(ext.id)}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => uninstallExtension(ext.id)}
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Available Extensions */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Available in Marketplace
            </h4>
            
            <div className="space-y-2">
              {available.map(ext => (
                <Card key={ext.id} className="bg-[#161b22] border-[#30363d]">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {ext.icon}
                          <span className="text-sm font-medium">{ext.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {ext.description}
                        </p>
                        <Badge variant="outline" className="text-xs mt-2">
                          v{ext.version}
                        </Badge>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => installExtension(ext)}
                      >
                        <Download className="w-3 h-3 mr-1" /> Install
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
