'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronRight, ChevronDown, Search, Eye, Trash2, Copy,
  Database, Hash, Type, List, Grid, BarChart3, Image
} from 'lucide-react';

interface VariableInspectorProps {
  theme: string;
}

interface Variable {
  name: string;
  type: 'array' | 'dataframe' | 'scalar' | 'string' | 'list' | 'dict' | 'image' | 'model';
  value: string;
  shape?: string;
  dtype?: string;
  size?: string;
  children?: Variable[];
  preview?: string;
}

const sampleVariables: Variable[] = [
  {
    name: 'df',
    type: 'dataframe',
    value: 'DataFrame',
    shape: '24847 × 35',
    dtype: 'pandas.DataFrame',
    size: '6.2 MB',
    preview: 'TEAM_NAME,FG_PCT,FG3_PCT,PTS...',
    children: [
      { name: 'TEAM_NAME', type: 'string', value: 'Series', shape: '24847', dtype: 'object' },
      { name: 'FG_PCT', type: 'array', value: 'Series', shape: '24847', dtype: 'float64' },
      { name: 'PTS', type: 'array', value: 'Series', shape: '24847', dtype: 'int64' }
    ]
  },
  {
    name: 'biotech_metrics',
    type: 'dataframe',
    value: 'DataFrame',
    shape: '30 × 6',
    dtype: 'pandas.DataFrame',
    size: '1.4 KB',
    preview: 'Transfection_Efficiency,Specificity_Ratio...',
    children: [
      { name: 'Transfection_Efficiency', type: 'array', value: 'Series', shape: '30', dtype: 'float64' },
      { name: 'Specificity_Ratio', type: 'array', value: 'Series', shape: '30', dtype: 'float64' }
    ]
  },
  {
    name: 'corr_matrix',
    type: 'array',
    value: 'ndarray',
    shape: '(6, 6)',
    dtype: 'float64',
    size: '288 B',
    preview: '[[1.0, 0.85, ...], [0.85, 1.0, ...], ...]'
  },
  {
    name: 'teams',
    type: 'list',
    value: 'list',
    shape: '30',
    dtype: 'list[str]',
    size: '2.1 KB',
    preview: "['Boston Celtics', 'Golden State Warriors', ...]"
  },
  {
    name: 'config',
    type: 'dict',
    value: 'dict',
    shape: '5 keys',
    dtype: 'dict',
    size: '512 B',
    preview: "{'data_path': '/data/nba', 'season': '2023-24', ...}",
    children: [
      { name: 'data_path', type: 'string', value: "'/data/nba'" },
      { name: 'season', type: 'string', value: "'2023-24'" },
      { name: 'n_teams', type: 'scalar', value: '30', dtype: 'int' }
    ]
  },
  {
    name: 'fg_pct_mean',
    type: 'scalar',
    value: '0.4567',
    dtype: 'float64',
    size: '8 B'
  },
  {
    name: 'fig',
    type: 'image',
    value: 'Figure',
    shape: '1000×800',
    dtype: 'matplotlib.figure.Figure',
    size: '45 KB',
    preview: 'correlation_matrix.png'
  },
  {
    name: 'model',
    type: 'model',
    value: 'LinearRegression',
    shape: '',
    dtype: 'sklearn.linear_model',
    size: '1.2 KB'
  }
];

export default function VariableInspector({ theme }: VariableInspectorProps) {
  const [variables, setVariables] = useState<Variable[]>(sampleVariables);
  const [expandedVars, setExpandedVars] = useState<string[]>(['df']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVar, setSelectedVar] = useState<Variable | null>(null);

  const toggleExpand = (name: string) => {
    setExpandedVars(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const getTypeIcon = (type: Variable['type']) => {
    switch (type) {
      case 'array': return <Grid className="w-4 h-4 text-blue-500" />;
      case 'dataframe': return <Database className="w-4 h-4 text-green-500" />;
      case 'scalar': return <Hash className="w-4 h-4 text-yellow-500" />;
      case 'string': return <Type className="w-4 h-4 text-purple-500" />;
      case 'list': return <List className="w-4 h-4 text-orange-500" />;
      case 'dict': return <BarChart3 className="w-4 h-4 text-pink-500" />;
      case 'image': return <Image className="w-4 h-4 text-cyan-500" alt="" />;
      case 'model': return <BarChart3 className="w-4 h-4 text-red-500" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  const filteredVariables = variables.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVariable = (variable: Variable, depth: number = 0) => (
    <div key={variable.name}>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors ${
          selectedVar?.name === variable.name 
            ? theme === 'dark' ? 'bg-[#21262d]' : 'bg-gray-100'
            : theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => setSelectedVar(variable)}
      >
        {variable.children ? (
          <button onClick={(e) => { e.stopPropagation(); toggleExpand(variable.name); }}>
            {expandedVars.includes(variable.name) ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        
        {getTypeIcon(variable.type)}
        
        <span className="font-mono text-sm text-blue-400">{variable.name}</span>
        
        <span className="text-xs text-gray-500">{variable.value}</span>
        
        {variable.shape && (
          <Badge variant="outline" className="text-xs ml-auto">{variable.shape}</Badge>
        )}
      </div>
      
      {variable.children && expandedVars.includes(variable.name) && (
        <div className={`border-l ml-4 ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          {variable.children.map(child => renderVariable(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex">
      {/* Variable List */}
      <div className={`w-72 border-r flex flex-col ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className={`p-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter variables..."
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="py-1">
            {filteredVariables.map(variable => renderVariable(variable))}
          </div>
        </ScrollArea>
        
        {/* Memory Footer */}
        <div className={`px-3 py-2 border-t ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Memory Usage</span>
            <span className="text-green-400">8.5 MB / 2 GB</span>
          </div>
          <div className="h-1 bg-gray-700 rounded mt-1">
            <div className="h-full w-[5%] bg-green-500 rounded" />
          </div>
        </div>
      </div>
      
      {/* Variable Details */}
      <div className="flex-1 flex flex-col">
        {selectedVar ? (
          <>
            <div className={`px-3 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
              <h3 className="font-mono text-lg">{selectedVar.name}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-3">
                {/* Type Info */}
                <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm">Type Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type</span>
                      <span className="font-mono">{selectedVar.dtype || selectedVar.type}</span>
                    </div>
                    {selectedVar.shape && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shape</span>
                        <span className="font-mono">{selectedVar.shape}</span>
                      </div>
                    )}
                    {selectedVar.size && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Size</span>
                        <span className="font-mono">{selectedVar.size}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Preview */}
                {selectedVar.preview && (
                  <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className={`p-2 rounded text-xs overflow-x-auto ${
                        theme === 'dark' ? 'bg-[#0d1117] text-gray-300' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {selectedVar.preview}
                      </pre>
                    </CardContent>
                  </Card>
                )}
                
                {/* Quick Stats for Arrays */}
                {selectedVar.type === 'array' && (
                  <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">min</span>
                          <span className="font-mono">0.234</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">max</span>
                          <span className="font-mono">0.678</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">mean</span>
                          <span className="font-mono">0.457</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">std</span>
                          <span className="font-mono">0.089</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* DataFrame Head */}
                {selectedVar.type === 'dataframe' && (
                  <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm">Head (5 rows)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[#30363d]">
                              <th className="text-left py-1 px-2">TEAM_NAME</th>
                              <th className="text-right py-1 px-2">FG_PCT</th>
                              <th className="text-right py-1 px-2">PTS</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td className="py-1 px-2">Boston Celtics</td><td className="text-right">0.475</td><td className="text-right">120.6</td></tr>
                            <tr><td className="py-1 px-2">Golden State Warriors</td><td className="text-right">0.472</td><td className="text-right">118.4</td></tr>
                            <tr><td className="py-1 px-2">Phoenix Suns</td><td className="text-right">0.469</td><td className="text-right">116.2</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select a variable to inspect</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
