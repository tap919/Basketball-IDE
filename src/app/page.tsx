'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleDot, Dna, Database, ArrowRight, Sparkles, BarChart3, Terminal, Puzzle } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: CircleDot,
      title: 'NBA Statistics',
      description: 'Comprehensive game-level data from 2010-2024 regular season and playoffs',
      badge: '24,847 Games'
    },
    {
      icon: Dna,
      title: 'Biotech Translation',
      description: 'Map basketball concepts to pharmaceutical and biotech research analogies',
      badge: '12 Analogies'
    },
    {
      icon: Terminal,
      title: 'Local LLM Integration',
      description: 'Connect to Ollama/LM Studio for AI-powered analysis and translation',
      badge: 'Privacy First'
    },
    {
      icon: Puzzle,
      title: 'Extension System',
      description: 'VSCode-like extensibility with custom analysis modules',
      badge: 'Modular'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] text-white">
      {/* Header */}
      <header className="border-b border-[#30363d]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CircleDot className="w-8 h-8 text-orange-500" />
              <Dna className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CircleDot → Biotech IDE</h1>
              <p className="text-xs text-gray-500">Statistical Translation Platform</p>
            </div>
          </div>
          
          <Link href="/basketball-ide">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Launch IDE
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="outline" className="mb-6 text-emerald-400 border-emerald-600">
          <Sparkles className="w-3 h-3 mr-1" /> AI-Powered Statistical Translation
        </Badge>
        
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
          Where Sports Analytics Meets
          <br />
          Biotech Research
        </h2>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          An IDE-like platform that translates NBA basketball statistics into 
          biotech research concepts, powered by local LLMs for privacy-first analysis.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Link href="/basketball-ide">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Open IDE
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            <Database className="w-4 h-4 mr-2" />
            Browse Data
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-center mb-8">Platform Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#161b22] border-[#30363d] hover:border-[#4a5568] transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <feature.icon className="w-6 h-6 text-emerald-500" />
                  <Badge variant="secondary" className="text-xs">{feature.badge}</Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Translation Preview */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-[#161b22] border-[#30363d] max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Translation Example
            </CardTitle>
            <CardDescription>
              How basketball statistics map to biotech concepts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
                <div className="flex items-center gap-2 mb-2">
                  <CircleDot className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">CircleDot</span>
                </div>
                <div className="text-lg font-bold">FG% = 45%</div>
                <div className="text-xs text-gray-500 mt-1">Field Goal Percentage</div>
              </div>
              
              <div className="flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-gray-500" />
              </div>
              
              <div className="p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
                <div className="flex items-center gap-2 mb-2">
                  <Dna className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Biotech</span>
                </div>
                <div className="text-lg font-bold">Transfection Efficiency</div>
                <div className="text-xs text-gray-500 mt-1">Gene Delivery Success Rate</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
              <p className="text-sm text-gray-400">
                <strong className="text-white">Analogy:</strong> Just as FG% measures successful shots 
                out of attempts, transfection efficiency measures successful gene deliveries out of 
                total attempts in molecular biology. Both metrics indicate the effectiveness of a 
                delivery mechanism.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#30363d] mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>CircleDot-to-Biotech IDE • Built with Next.js 16, Tailwind CSS, and Shadcn UI</p>
          <p className="mt-1">Data: NBA Stats 2010-2024 • Local LLM Support via Ollama</p>
        </div>
      </footer>
    </div>
  );
}
