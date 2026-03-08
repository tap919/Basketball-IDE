'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Server, Cpu, HardDrive, Wifi, Play, Square, RefreshCw, Plus, Folder,
  ChevronRight, ChevronDown, Clock, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';

interface RemotePanelProps {
  theme: string;
}

interface Connection {
  id: string;
  name: string;
  host: string;
  type: 'ssh' | 'slurm' | 'pbs' | 'cloud';
  status: 'connected' | 'disconnected' | 'connecting';
  resources?: {
    cpu: number;
    memory: string;
    gpu?: number;
  };
}

interface Job {
  id: string;
  name: string;
  status: 'running' | 'queued' | 'completed' | 'failed';
  nodes: number;
  time: string;
  connectionId: string;
}

const sampleConnections: Connection[] = [
  { id: '1', name: 'Lab Cluster', host: 'hpc.lab.edu', type: 'slurm', status: 'connected', resources: { cpu: 128, memory: '512GB', gpu: 8 } },
  { id: '2', name: 'Cloud GPU', host: 'gpu.cloud.com', type: 'cloud', status: 'connected', resources: { cpu: 32, memory: '128GB', gpu: 4 } },
  { id: '3', name: 'Dev Server', host: 'dev.internal', type: 'ssh', status: 'disconnected' }
];

const sampleJobs: Job[] = [
  { id: 'J001', name: 'biotech_analysis_2024', status: 'running', nodes: 4, time: '2:34:15', connectionId: '1' },
  { id: 'J002', name: 'correlation_matrix', status: 'running', nodes: 2, time: '0:45:22', connectionId: '1' },
  { id: 'J003', name: 'batch_translation', status: 'queued', nodes: 1, time: '-', connectionId: '1' },
  { id: 'J004', name: 'gpu_training', status: 'running', nodes: 1, time: '1:15:00', connectionId: '2' },
  { id: 'J005', name: 'validation_run', status: 'completed', nodes: 2, time: '0:32:10', connectionId: '1' },
  { id: 'J006', name: 'failed_job', status: 'failed', nodes: 1, time: '0:05:23', connectionId: '2' }
];

export default function RemotePanel({ theme }: RemotePanelProps) {
  const [connections, setConnections] = useState(sampleConnections);
  const [jobs, setJobs] = useState(sampleJobs);
  const [selectedConnection, setSelectedConnection] = useState<string | null>('1');

  const getStatusIcon = (status: Connection['status'] | Job['status']) => {
    switch (status) {
      case 'connected':
      case 'running': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />;
      case 'queued': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTypeBadge = (type: Connection['type']) => {
    switch (type) {
      case 'slurm': return <Badge className="bg-blue-600 text-xs">Slurm</Badge>;
      case 'pbs': return <Badge className="bg-purple-600 text-xs">PBS</Badge>;
      case 'cloud': return <Badge className="bg-green-600 text-xs">Cloud</Badge>;
      default: return <Badge variant="outline" className="text-xs">SSH</Badge>;
    }
  };

  return (
    <div className="h-full flex">
      {/* Connections */}
      <div className={`w-64 border-r flex flex-col ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className={`px-3 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <span className="text-sm font-medium">Connections</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {connections.map(conn => (
              <button
                key={conn.id}
                onClick={() => setSelectedConnection(conn.id)}
                className={`w-full text-left p-2 rounded mb-1 ${
                  selectedConnection === conn.id
                    ? theme === 'dark' ? 'bg-[#21262d]' : 'bg-gray-100'
                    : theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(conn.status)}
                  <span className="font-medium text-sm">{conn.name}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {getTypeBadge(conn.type)}
                  <span className="text-xs text-gray-500 font-mono">{conn.host}</span>
                </div>
                {conn.resources && (
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>CPU: {conn.resources.cpu}</span>
                    <span>RAM: {conn.resources.memory}</span>
                    {conn.resources.gpu && <span>GPU: {conn.resources.gpu}</span>}
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
        
        {/* Add Connection */}
        <div className={`p-2 border-t ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <Button variant="outline" className="w-full h-8 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Connection
          </Button>
        </div>
      </div>
      
      {/* Jobs & Resources */}
      <div className="flex-1 flex flex-col">
        {/* Resource Monitor */}
        <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Resource Monitor</span>
            <Button variant="ghost" size="sm" className="h-6">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">CPU</span>
                <span>87%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded mt-1">
                <div className="h-full w-[87%] bg-blue-500 rounded" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Memory</span>
                <span>65%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded mt-1">
                <div className="h-full w-[65%] bg-green-500 rounded" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">GPU</span>
                <span>92%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded mt-1">
                <div className="h-full w-[92%] bg-purple-500 rounded" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Job Queue */}
        <div className={`px-3 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <span className="text-sm font-medium">Job Queue</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7">
              <Play className="w-4 h-4 mr-1 text-green-500" />
              Submit
            </Button>
            <Button variant="ghost" size="sm" className="h-7">
              <Square className="w-4 h-4 mr-1 text-red-500" />
              Cancel
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left text-gray-500 text-xs ${theme === 'dark' ? 'border-b border-[#30363d]' : 'border-b border-gray-200'}`}>
                  <th className="py-2">Job ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Nodes</th>
                  <th className="py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className={`${
                    theme === 'dark' ? 'border-b border-[#30363d]' : 'border-b border-gray-200'
                  }`}>
                    <td className="py-2 font-mono text-xs">{job.id}</td>
                    <td className="py-2">{job.name}</td>
                    <td className="py-2">{getStatusIcon(job.status)}</td>
                    <td className="py-2">{job.nodes}</td>
                    <td className="py-2 font-mono">{job.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
        
        {/* Quick Submit */}
        <div className={`px-3 py-2 border-t ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="flex gap-2">
            <Input placeholder="sbatch script.sh" className="h-8 text-sm" />
            <Button size="sm" className="h-8">
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
