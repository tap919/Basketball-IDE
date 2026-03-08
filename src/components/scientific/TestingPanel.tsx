'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Play, RefreshCw, Check, X, Clock, AlertCircle, ChevronRight, ChevronDown,
  Zap, BarChart3, Timer, TestTube
} from 'lucide-react';

interface TestingPanelProps {
  theme: string;
}

interface TestCase {
  id: string;
  name: string;
  file: string;
  status: 'passed' | 'failed' | 'skipped' | 'running' | 'pending';
  duration?: number;
  message?: string;
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestCase[];
  status: 'idle' | 'running' | 'complete';
}

const sampleSuites: TestSuite[] = [
  {
    id: '1',
    name: 'test_analysis.py',
    status: 'complete',
    tests: [
      { id: '1-1', name: 'test_transfection_efficiency', file: 'test_analysis.py', status: 'passed', duration: 0.23 },
      { id: '1-2', name: 'test_specificity_ratio', file: 'test_analysis.py', status: 'passed', duration: 0.15 },
      { id: '1-3', name: 'test_synergy_index', file: 'test_analysis.py', status: 'passed', duration: 0.18 },
      { id: '1-4', name: 'test_adverse_events', file: 'test_analysis.py', status: 'failed', duration: 0.45, message: 'AssertionError: Expected 0.15, got 0.18' }
    ]
  },
  {
    id: '2',
    name: 'test_biotech_convert.py',
    status: 'complete',
    tests: [
      { id: '2-1', name: 'test_fg_to_transfection', file: 'test_biotech_convert.py', status: 'passed', duration: 0.02 },
      { id: '2-2', name: 'test_ast_to_synergy', file: 'test_biotech_convert.py', status: 'passed', duration: 0.01 },
      { id: '2-3', name: 'test_tov_to_adverse', file: 'test_biotech_convert.py', status: 'passed', duration: 0.02 }
    ]
  },
  {
    id: '3',
    name: 'test_data_pipeline.py',
    status: 'complete',
    tests: [
      { id: '3-1', name: 'test_data_loading', file: 'test_data_pipeline.py', status: 'passed', duration: 1.23 },
      { id: '3-2', name: 'test_data_cleaning', file: 'test_data_pipeline.py', status: 'passed', duration: 0.89 },
      { id: '3-3', name: 'test_aggregation', file: 'test_data_pipeline.py', status: 'skipped', message: 'Requires external data' }
    ]
  }
];

const benchmarks = [
  { name: 'calculate_metrics()', iterations: 1000, time: '2.34s', ops: '427/s' },
  { name: 'translate_to_biotech()', iterations: 10000, time: '1.12s', ops: '8929/s' },
  { name: 'batch_process()', iterations: 100, time: '5.67s', ops: '18/s' }
];

export default function TestingPanel({ theme }: TestingPanelProps) {
  const [suites, setSuites] = useState(sampleSuites);
  const [expandedSuites, setExpandedSuites] = useState<string[]>(['1']);
  const [running, setRunning] = useState(false);

  const toggleSuite = (id: string) => {
    setExpandedSuites(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const runAllTests = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 2000);
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed': return <Check className="w-4 h-4 text-green-500" />;
      case 'failed': return <X className="w-4 h-4 text-red-500" />;
      case 'skipped': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const stats = {
    total: suites.reduce((sum, s) => sum + s.tests.length, 0),
    passed: suites.reduce((sum, s) => sum + s.tests.filter(t => t.status === 'passed').length, 0),
    failed: suites.reduce((sum, s) => sum + s.tests.filter(t => t.status === 'failed').length, 0),
    skipped: suites.reduce((sum, s) => sum + s.tests.filter(t => t.status === 'skipped').length, 0)
  };

  const coverage = 87;

  return (
    <div className="h-full flex">
      {/* Test List */}
      <div className={`w-80 border-r flex flex-col ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className={`px-3 py-2 border-b flex items-center justify-between ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <span className="font-medium">Tests</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7" onClick={runAllTests} disabled={running}>
              {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-green-500" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-7">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-500">{stats.passed} passed</span>
            <span className="text-red-500">{stats.failed} failed</span>
            <span className="text-yellow-500">{stats.skipped} skipped</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Pass Rate</span>
              <span>{((stats.passed / stats.total) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(stats.passed / stats.total) * 100} className="h-1" />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {suites.map(suite => (
              <div key={suite.id} className="mb-1">
                <button
                  onClick={() => toggleSuite(suite.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded ${
                    theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                  }`}
                >
                  {expandedSuites.includes(suite.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <TestTube className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-mono truncate">{suite.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {suite.tests.filter(t => t.status === 'passed').length}/{suite.tests.length}
                  </Badge>
                </button>
                
                {expandedSuites.includes(suite.id) && (
                  <div className="ml-6 pl-2 border-l border-[#30363d]">
                    {suite.tests.map(test => (
                      <div
                        key={test.id}
                        className={`flex items-center gap-2 px-2 py-1 text-sm ${
                          theme === 'dark' ? 'hover:bg-[#161b22]' : 'hover:bg-gray-50'
                        }`}
                      >
                        {getStatusIcon(test.status)}
                        <span className="font-mono truncate">{test.name}</span>
                        {test.duration && (
                          <span className="text-xs text-gray-500 ml-auto">{test.duration}s</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Details */}
      <div className="flex-1 flex flex-col">
        {/* Coverage */}
        <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Code Coverage</span>
            <Badge className={coverage >= 80 ? 'bg-green-600' : coverage >= 60 ? 'bg-yellow-600' : 'bg-red-600'}>
              {coverage}%
            </Badge>
          </div>
          <Progress value={coverage} className="h-2 mt-2" />
        </div>
        
        {/* Test Output */}
        <ScrollArea className="flex-1">
          <div className="p-3">
            <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Failed: test_adverse_events</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className={`p-2 rounded text-xs ${
                  theme === 'dark' ? 'bg-[#0d1117] text-red-400' : 'bg-gray-50 text-red-600'
                }`}>
{`AssertionError: Expected 0.15, got 0.18

File: test_analysis.py:45

def test_adverse_events():
    result = calculate_adverse_rate(turnovers=12.3, games=82)
    assert result == 0.15  # <-- FAILED
    # Actual: 0.18`}
                </pre>
              </CardContent>
            </Card>
            
            {/* Benchmarks */}
            <Card className={`mt-4 ${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-1">Function</th>
                      <th className="py-1">Iterations</th>
                      <th className="py-1">Time</th>
                      <th className="py-1">Ops/s</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarks.map((b, i) => (
                      <tr key={i} className="font-mono">
                        <td className="py-1">{b.name}</td>
                        <td className="py-1">{b.iterations.toLocaleString()}</td>
                        <td className="py-1">{b.time}</td>
                        <td className="py-1 text-green-400">{b.ops}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
