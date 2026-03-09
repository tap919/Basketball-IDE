'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Network, ZoomIn, ZoomOut, Sparkles, CircleDot, Dna, Heart, Target,
  Lightbulb
} from 'lucide-react';

interface KnowledgeNode {
  id: string;
  label: string;
  type: 'basketball' | 'biotech' | 'disease' | 'treatment';
  x: number;
  y: number;
  connections: string[];
  description: string;
  importance: number;
}

const nodes: KnowledgeNode[] = [
  { id: 'fg-pct', label: 'FG%', type: 'basketball', x: 120, y: 80, connections: ['transfection'], description: 'Shooting accuracy', importance: 5 },
  { id: 'assists', label: 'Assists', type: 'basketball', x: 80, y: 160, connections: ['synergy'], description: 'Team play', importance: 4 },
  { id: 'turnovers', label: 'Turnovers', type: 'basketball', x: 160, y: 160, connections: ['adverse'], description: 'Lost possessions', importance: 4 },
  { id: 'clutch', label: 'Clutch', type: 'basketball', x: 240, y: 120, connections: ['breakthrough'], description: 'Pressure performance', importance: 5 },
  
  { id: 'transfection', label: 'Transfection', type: 'biotech', x: 320, y: 80, connections: ['gene-therapy'], description: 'Gene delivery rate', importance: 5 },
  { id: 'synergy', label: 'Synergy', type: 'biotech', x: 280, y: 160, connections: ['combo-therapy'], description: 'Drug combination effect', importance: 4 },
  { id: 'adverse', label: 'Adverse Events', type: 'biotech', x: 360, y: 160, connections: ['safety'], description: 'Side effects', importance: 4 },
  
  { id: 'alzheimer', label: "Alzheimer's", type: 'disease', x: 480, y: 80, connections: ['clutch'], description: 'Neurodegenerative disease', importance: 5 },
  { id: 'cancer', label: 'Cancer', type: 'disease', x: 520, y: 160, connections: ['car-t'], description: 'Uncontrolled cell growth', importance: 5 },
  
  { id: 'gene-therapy', label: 'Gene Therapy', type: 'treatment', x: 600, y: 80, connections: ['crispr'], description: 'Genetic correction', importance: 5 },
  { id: 'car-t', label: 'CAR-T', type: 'treatment', x: 640, y: 160, connections: ['cancer'], description: 'Engineered immune cells', importance: 5 },
  { id: 'crispr', label: 'CRISPR', type: 'treatment', x: 720, y: 120, connections: ['gene-therapy'], description: 'Gene editing', importance: 5 },
];

const edges = [
  { source: 'fg-pct', target: 'transfection', strength: 0.95 },
  { source: 'assists', target: 'synergy', strength: 0.82 },
  { source: 'turnovers', target: 'adverse', strength: 0.92 },
  { source: 'clutch', target: 'alzheimer', strength: 0.88 },
  { source: 'transfection', target: 'gene-therapy', strength: 0.90 },
  { source: 'synergy', target: 'combo-therapy', strength: 0.85 },
  { source: 'car-t', target: 'cancer', strength: 0.88 },
  { source: 'gene-therapy', target: 'crispr', strength: 0.95 },
];

const nodeColors = {
  basketball: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400' },
  biotech: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' },
  disease: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
  treatment: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' }
};

export default function KnowledgeGraph() {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x * zoom + 40, source.y * zoom + 20);
        ctx.lineTo(target.x * zoom + 40, target.y * zoom + 20);
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = edge.strength * 2;
        ctx.stroke();
      }
    });
  }, [zoom]);

  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      <div className="p-3 border-b border-[#30363d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" />
            <h3 className="font-medium">Knowledge Graph</h3>
            <Badge variant="outline" className="text-xs">Interactive</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDiscovery(!showDiscovery)}>
              <Sparkles className="w-3 h-3 mr-1" />
              Discover
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <canvas ref={canvasRef} width={900} height={400} className="absolute inset-0" />
        
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          {nodes.map(node => {
            const colors = nodeColors[node.type];
            return (
              <div
                key={node.id}
                className={`absolute cursor-pointer ${colors.bg} border ${colors.border} rounded-lg p-2 hover:scale-110 transition-transform`}
                style={{ left: node.x, top: node.y }}
                onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
              >
                <div className={`text-[10px] font-medium ${colors.text}`}>{node.label}</div>
              </div>
            );
          })}
        </div>

        {selectedNode && (
          <Card className="absolute bottom-4 right-4 w-64 bg-[#161b22] border-[#30363d]">
            <CardContent className="p-3">
              <div className="font-medium text-sm mb-1">{selectedNode.label}</div>
              <p className="text-xs text-gray-400">{selectedNode.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                Type: <Badge variant="outline" className="text-[10px]">{selectedNode.type}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {showDiscovery && (
          <Card className="absolute top-4 right-4 w-72 bg-[#161b22] border-purple-500/50">
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                AI Discovered Connections
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/30">
                <div className="text-xs text-emerald-400 font-medium">Novel Connection</div>
                <p className="text-xs text-gray-300">Clutch Performance → Late-stage Disease Efficacy</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded border border-blue-500/30">
                <div className="text-xs text-blue-400 font-medium">Pattern Match</div>
                <p className="text-xs text-gray-300">Assist Networks → Drug Synergy Networks</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
