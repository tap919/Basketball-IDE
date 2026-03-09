'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileText, Download, Copy, Check, Eye, Edit3, Save,
  BookOpen, Users, Calendar, Hash, Quote, BarChart3,
  Shield, Award, ExternalLink
} from 'lucide-react';

interface ReportSection {
  id: string;
  title: string;
  content: string;
  editable: boolean;
}

interface ExperimentReport {
  title: string;
  authors: string[];
  abstract: string;
  sections: ReportSection[];
  methodology: string;
  results: string;
  conclusions: string;
  references: string[];
  confidence: number;
  reproducibility: number;
  generatedAt: Date;
}

export default function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<ExperimentReport | null>(null);
  const [copied, setCopied] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate AI report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedReport: ExperimentReport = {
      title: 'Novel Multi-Target Therapeutic Approach for Alzheimer\'s Disease Using Basketball Analytics-Derived Optimization Algorithms',
      authors: ['Citizen Scientist', 'CircleDot AI Research Platform'],
      abstract: `Background: Alzheimer's disease (AD) remains one of the most challenging neurodegenerative disorders, with no disease-modifying treatments currently available. This study applies basketball analytics optimization principles to identify novel therapeutic combinations targeting multiple AD pathology mechanisms simultaneously.

Methods: We translated basketball lineup optimization mathematics—specifically the algorithms used to maximize player combinations for different game situations—into drug combination prediction models. The approach treats each drug target as a "player" and disease pathways as "game situations" requiring optimal coverage.

Results: Our basketball-derived optimization algorithm identified a three-drug combination targeting amyloid-beta clearance, tau reduction, and synaptic plasticity enhancement. In silico predictions showed 78% improvement over single-target approaches. The combination achieved a "team efficiency score" (analogous to basketball's plus/minus) of +8.5, indicating strong therapeutic potential.

Conclusions: This work demonstrates that sports analytics principles can inform drug discovery, providing a novel framework for combination therapy design. The citizen scientist-driven approach, supported by AI hypothesis generation, offers a new model for accelerating therapeutic development.`,
      sections: [
        {
          id: 'intro',
          title: 'Introduction',
          content: `Alzheimer's disease affects approximately 50 million people worldwide, with prevalence expected to triple by 2050. Despite decades of research, no disease-modifying treatments exist. The failure of single-target approaches suggests that AD may require multi-target intervention strategies, similar to how successful basketball teams require coordinated efforts from multiple players.\n\nThis study introduces a novel paradigm: applying basketball analytics optimization to drug combination discovery. Just as coaches optimize lineups based on player strengths, opponent tendencies, and game situations, we propose that optimal drug combinations can be identified through similar mathematical frameworks.`,
          editable: true
        },
        {
          id: 'methods',
          title: 'Methods',
          content: `2.1 Basketball-to-Biotech Translation Framework\n\nWe developed a mathematical mapping between basketball lineup optimization and drug combination selection:\n\n• Player Efficiency Rating (PER) → Drug Target Efficacy Score\n• Lineup Plus/Minus → Combination Therapeutic Index\n• Player Synergy Metrics → Drug-Drug Interaction Scores\n• Clutch Performance → Late-Stage Disease Efficacy\n\n2.2 Data Sources\n\n• NBA player statistics (2010-2024)\n• DrugBank compound database\n• Alzheimer's Disease Neuroimaging Initiative (ADNI) data\n• ClinicalTrials.gov completed AD trials\n\n2.3 Optimization Algorithm\n\nOur adapted lineup optimization algorithm considers:\n1. Individual target efficacy (analogous to player PER)\n2. Target combination synergy (analogous to lineup chemistry)\n3. Pathway coverage (analogous to defensive schemes)\n4. Resistance potential (analogous to opponent counter-moves)`,
          editable: true
        },
        {
          id: 'results',
          title: 'Results',
          content: `3.1 Optimal Drug Combination Identification\n\nThe algorithm identified a three-drug combination with the following characteristics:\n\n| Drug Target | Basketball Analogy | Predicted Efficacy |\n|------------|-------------------|-------------------|\n| BACE1 (Amyloid) | Elite Scorer | 78% clearance rate |\n| GSK3β (Tau) | Elite Defender | 65% tangle reduction |\n| BDNF Enhancement | Playmaker | 45% synaptic improvement |\n\n3.2 Therapeutic Index Analysis\n\nThe combination achieved a therapeutic index of 8.5 (95% CI: 7.2-9.8), comparable to the plus/minus rating of elite NBA lineups. Individual drug contributions showed synergistic interaction (synergy index = 1.42).\n\n3.3 Validation Against Historical Data\n\nTesting the algorithm against completed AD clinical trials showed:\n• Correctly predicted 73% of failed single-target trials\n• Identified promising combinations in 12 of 15 successful multi-drug studies`,
          editable: true
        },
        {
          id: 'discussion',
          title: 'Discussion',
          content: `This study demonstrates the potential of sports analytics principles to inform biomedical research. The key insight is that both basketball and disease treatment involve complex systems requiring optimized resource allocation under uncertainty.\n\nThe citizen scientist approach, enabled by AI hypothesis generation, opens new possibilities for drug discovery. By democratizing access to advanced analytical tools, we may accelerate the identification of breakthrough therapies.\n\nLimitations:\n• In silico predictions require experimental validation\n• Basketball-biotech analogies are imperfect mappings\n• Small sample sizes in some validation analyses\n\nFuture Directions:\n• Validate predictions in animal models\n• Extend framework to other diseases\n• Develop real-time optimization algorithms`,
          editable: true
        }
      ],
      methodology: 'Basketball analytics optimization translated to drug discovery',
      results: 'Three-drug combination identified with 78% predicted improvement',
      conclusions: 'Sports analytics can inform therapeutic development',
      references: [
        'Goldberry, R. (2019). SprawlBall: A Visual Tour of the New Era of the NBA.',
        'Selkoe, D.J. & Hardy, J. (2016). The amyloid hypothesis of Alzheimer\'s disease at 25 years.',
        'Cheng, F. et al. (2019). Systems pharmacology for rational drug combination discovery.',
        'Citizen Science Association (2023). Best Practices for Community-Driven Research.'
      ],
      confidence: 87,
      reproducibility: 82,
      generatedAt: new Date()
    };
    
    setReport(generatedReport);
    setIsGenerating(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditSection = (sectionId: string, content: string) => {
    setEditingSection(sectionId);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (report && editingSection) {
      setReport({
        ...report,
        sections: report.sections.map(s => 
          s.id === editingSection ? { ...s, content: editContent } : s
        )
      });
      setEditingSection(null);
    }
  };

  const downloadReport = (format: 'markdown' | 'pdf' | 'json') => {
    if (!report) return;
    
    let content = '';
    if (format === 'markdown') {
      content = `# ${report.title}\n\n`;
      content += `**Authors:** ${report.authors.join(', ')}\n\n`;
      content += `## Abstract\n\n${report.abstract}\n\n`;
      report.sections.forEach(s => {
        content += `## ${s.title}\n\n${s.content}\n\n`;
      });
      content += `## References\n\n`;
      report.references.forEach((r, i) => {
        content += `${i + 1}. ${r}\n`;
      });
    } else if (format === 'json') {
      content = JSON.stringify(report, null, 2);
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-report.${format}`;
    a.click();
  };

  if (!report) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card className="w-full max-w-lg bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Publication-Ready Report Generator
            </CardTitle>
            <CardDescription>
              Generate a professional scientific report from your experiment results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-gray-300">
                This tool transforms your experiment data into a formatted scientific manuscript 
                ready for peer review or submission to preprint servers.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Trust Score: 87%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Peer Review Ready</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={generateReport}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Report...' : 'Generate Report'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Report Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-emerald-400 border-emerald-600">
                Preprint Ready
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(report.abstract)}>
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadReport('markdown')}>
                  <Download className="w-3 h-3 mr-1" />
                  MD
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadReport('json')}>
                  <Download className="w-3 h-3 mr-1" />
                  JSON
                </Button>
              </div>
            </div>
            
            <h1 className="text-xl font-bold">{report.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {report.authors.join(', ')}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {report.generatedAt.toLocaleDateString()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Abstract */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Abstract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{report.abstract}</p>
            </CardContent>
          </Card>

          {/* Sections */}
          {report.sections.map(section => (
            <Card key={section.id} className="bg-[#161b22] border-[#30363d]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{section.title}</CardTitle>
                  {section.editable && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditSection(section.id, section.content)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === section.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingSection(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{section.content}</p>
                )}
              </CardContent>
            </Card>
          ))}

          {/* References */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Quote className="w-4 h-4 text-gray-400" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-400">
                {report.references.map((ref, i) => (
                  <li key={i}>{ref}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Quality Metrics */}
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Confidence Score</span>
                  <span className="font-bold text-emerald-400">{report.confidence}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Reproducibility</span>
                  <span className="font-bold text-blue-400">{report.reproducibility}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Sidebar */}
      <div className="w-72 border-l border-[#30363d] p-3">
        <h4 className="text-sm font-medium mb-3">Export Options</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => downloadReport('markdown')}>
            <FileText className="w-4 h-4 mr-2" />
            Markdown
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => downloadReport('json')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            JSON Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <ExternalLink className="w-4 h-4 mr-2" />
            bioRxiv Preprint
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <h4 className="text-sm font-medium mb-3">Submission Targets</h4>
        <div className="space-y-2">
          <Badge variant="outline" className="w-full justify-center py-1">Nature Communications</Badge>
          <Badge variant="outline" className="w-full justify-center py-1">PLOS ONE</Badge>
          <Badge variant="outline" className="w-full justify-center py-1">Scientific Reports</Badge>
        </div>
      </div>
    </div>
  );
}
