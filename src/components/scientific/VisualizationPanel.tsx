'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3, LineChart, ScatterChart, PieChart, AreaChart,
  Download, ZoomIn, ZoomOut, RotateCcw, Grid, Layers, Image
} from 'lucide-react';

interface VisualizationPanelProps {
  theme: string;
}

interface Plot {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'scatter' | 'pie' | 'heatmap' | 'histogram';
  library: 'matplotlib' | 'plotly' | 'ggplot2';
  createdAt: string;
  thumbnail?: string;
}

const samplePlots: Plot[] = [
  {
    id: '1',
    title: 'Transfection Efficiency Distribution',
    type: 'histogram',
    library: 'matplotlib',
    createdAt: '2024-01-15 10:30'
  },
  {
    id: '2',
    title: 'FG% vs 3P% Correlation',
    type: 'scatter',
    library: 'plotly',
    createdAt: '2024-01-15 10:35'
  },
  {
    id: '3',
    title: 'Season Trends 2010-2024',
    type: 'line',
    library: 'matplotlib',
    createdAt: '2024-01-15 10:40'
  },
  {
    id: '4',
    title: 'Team Performance Comparison',
    type: 'bar',
    library: 'ggplot2',
    createdAt: '2024-01-15 10:45'
  },
  {
    id: '5',
    title: 'Biotech Analogy Correlation Matrix',
    type: 'heatmap',
    library: 'plotly',
    createdAt: '2024-01-15 10:50'
  }
];

export default function VisualizationPanel({ theme }: VisualizationPanelProps) {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const toggleCompare = (plotId: string) => {
    if (selectedForCompare.includes(plotId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== plotId));
    } else if (selectedForCompare.length < 4) {
      setSelectedForCompare(prev => [...prev, plotId]);
    }
  };

  const getPlotIcon = (type: Plot['type']) => {
    switch (type) {
      case 'line': return <LineChart className="w-4 h-4" />;
      case 'bar': return <BarChart3 className="w-4 h-4" />;
      case 'scatter': return <ScatterChart className="w-4 h-4" />;
      case 'pie': return <PieChart className="w-4 h-4" />;
      case 'heatmap': return <Grid className="w-4 h-4" />;
      default: return <AreaChart className="w-4 h-4" />;
    }
  };

  const getLibraryColor = (library: Plot['library']) => {
    switch (library) {
      case 'matplotlib': return 'bg-blue-600';
      case 'plotly': return 'bg-purple-600';
      case 'ggplot2': return 'bg-green-600';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-7"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4 mr-1" />
            Gallery
          </Button>
          <Button 
            variant={viewMode === 'compare' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-7"
            onClick={() => setViewMode('compare')}
          >
            <Layers className="w-4 h-4 mr-1" />
            Compare
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Content */}
      {viewMode === 'grid' ? (
        <ScrollArea className="flex-1">
          <div className="p-4 grid grid-cols-2 gap-4">
            {samplePlots.map(plot => (
              <Card 
                key={plot.id}
                className={`cursor-pointer transition-all hover:border-blue-500 ${
                  theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'
                }`}
                onClick={() => setSelectedPlot(plot)}
              >
                <CardContent className="p-3">
                  {/* Placeholder for plot thumbnail */}
                  <div className={`h-32 rounded mb-2 flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gray-50'
                  }`}>
                    <div className="text-center">
                      {getPlotIcon(plot.type)}
                      <p className="text-xs text-gray-500 mt-2">Plot Preview</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{plot.title}</span>
                    <Badge className={`text-xs ${getLibraryColor(plot.library)}`}>
                      {plot.library}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{plot.createdAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Compare Selection */}
          <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <p className="text-sm text-gray-500">
              Select up to 4 plots to compare ({selectedForCompare.length}/4 selected)
            </p>
            <div className="flex gap-1 mt-2">
              {samplePlots.slice(0, 6).map(plot => (
                <Button
                  key={plot.id}
                  variant={selectedForCompare.includes(plot.id) ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toggleCompare(plot.id)}
                >
                  {plot.title.slice(0, 15)}...
                </Button>
              ))}
            </div>
          </div>
          
          {/* Comparison View */}
          <div className="flex-1 grid grid-cols-2 gap-2 p-2">
            {selectedForCompare.length === 0 ? (
              <div className="col-span-2 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select plots from above to compare</p>
                </div>
              </div>
            ) : (
              samplePlots
                .filter(plot => selectedForCompare.includes(plot.id))
                .map(plot => (
                  <div
                    key={plot.id}
                    className={`border rounded-lg p-2 ${
                      theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'
                    }`}
                  >
                    <div className={`h-40 rounded flex items-center justify-center ${
                      theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gray-50'
                    }`}>
                      <div className="text-center">
                        {getPlotIcon(plot.type)}
                        <p className="text-sm mt-2">{plot.title}</p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
      
      {/* Export Options */}
      <div className={`px-3 py-2 border-t ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Export as:</span>
          <button className="hover:text-white transition-colors">PNG</button>
          <button className="hover:text-white transition-colors">SVG</button>
          <button className="hover:text-white transition-colors">PDF</button>
          <button className="hover:text-white transition-colors">HTML (Interactive)</button>
        </div>
      </div>
    </div>
  );
}
