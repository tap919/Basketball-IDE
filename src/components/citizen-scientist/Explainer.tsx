'use client';

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  HelpCircle, BookOpen, Video, Lightbulb, ExternalLink,
  GraduationCap, ChevronRight
} from 'lucide-react';

interface ExplainerProps {
  term: string;
  simpleDefinition: string;
  technicalDefinition?: string;
  example?: string;
  basketballAnalogy?: string;
  learnMoreUrl?: string;
  children: React.ReactNode;
}

// Glossary of common scientific terms for citizen scientists
export const scienceGlossary: Record<string, Omit<ExplainerProps, 'children'>> = {
  'transfection': {
    term: 'Transfection',
    simpleDefinition: 'Getting genetic material (DNA/RNA) into cells - like delivering a message to the inside of a building.',
    technicalDefinition: 'The process of introducing nucleic acids into eukaryotic cells using non-viral methods.',
    basketballAnalogy: 'Like completing a pass to a teammate - you need to get the ball (genes) to the right player (cell).',
    example: 'Scientists use transfection to make cells produce specific proteins for study.'
  },
  'crispr': {
    term: 'CRISPR',
    simpleDefinition: 'A tool that can edit genes with high precision - like using a search-and-replace function for DNA.',
    technicalDefinition: 'Clustered Regularly Interspaced Short Palindromic Repeats - a gene editing technology using Cas9 nuclease.',
    basketballAnalogy: 'Like a coach drawing up a new play and erasing an old one on the whiteboard.',
    example: 'CRISPR can correct the genetic mutation that causes sickle cell disease.'
  },
  'biomarker': {
    term: 'Biomarker',
    simpleDefinition: 'A measurable sign that indicates a biological state - like a warning light on a car dashboard.',
    technicalDefinition: 'A measurable indicator of a biological state or condition, often used for disease detection.',
    basketballAnalogy: 'Like a player\'s stats that indicate how well they\'re performing.',
    example: 'Blood glucose levels are biomarkers for diabetes.'
  },
  'efficacy': {
    term: 'Efficacy',
    simpleDefinition: 'How well a treatment works under ideal conditions - the best-case scenario.',
    technicalDefinition: 'The capacity to produce a desired effect under ideal testing conditions.',
    basketballAnalogy: 'A player\'s performance in practice drills vs. actual games.',
    example: 'A vaccine with 95% efficacy prevents 95 out of 100 infections in controlled trials.'
  },
  'half-life': {
    term: 'Half-Life',
    simpleDefinition: 'The time it takes for half of something to be eliminated - like how long a battery lasts.',
    technicalDefinition: 'The time required for a quantity to reduce to half its initial value.',
    basketballAnalogy: 'Like how long a player can sustain peak performance before getting tired.',
    example: 'A drug with a 6-hour half-life needs to be taken multiple times per day.'
  },
  'amyloid': {
    term: 'Amyloid',
    simpleDefinition: 'Sticky protein clumps that build up in diseases like Alzheimer\'s - like plaque on teeth.',
    technicalDefinition: 'Aggregated protein fragments that form insoluble fibrils in tissues.',
    basketballAnalogy: 'Like debris accumulating on a basketball court that affects gameplay.',
    example: 'Amyloid plaques in the brain are a hallmark of Alzheimer\'s disease.'
  },
  'car-t': {
    term: 'CAR-T Cell',
    simpleDefinition: 'Immune cells engineered to fight cancer - like training soldiers to recognize specific enemies.',
    technicalDefinition: 'Chimeric Antigen Receptor T-cells - genetically modified T lymphocytes targeting specific antigens.',
    basketballAnalogy: 'Like training defenders to recognize and stop a specific offensive play.',
    example: 'CAR-T therapy has cured patients with previously untreatable blood cancers.'
  },
  'variant': {
    term: 'Variant',
    simpleDefinition: 'A genetic difference from the "standard" version - like having different colored eyes.',
    technicalDefinition: 'A specific genetic alteration or difference from the reference sequence.',
    basketballAnalogy: 'Like how different players have different shooting forms - variations on the same basic motion.',
    example: 'The Delta variant of COVID-19 spread faster than the original virus.'
  },
  'p-value': {
    term: 'P-value',
    simpleDefinition: 'The probability that results happened by chance - lower is better.',
    technicalDefinition: 'The probability of obtaining results as extreme as observed, assuming the null hypothesis is true.',
    basketballAnalogy: 'Like the odds of making a shot by accident vs. skill.',
    example: 'A p-value of 0.05 means there\'s only a 5% chance the results were random luck.'
  },
  'confidence-interval': {
    term: 'Confidence Interval',
    simpleDefinition: 'A range where we\'re fairly sure the true value lies - like a margin of error.',
    technicalDefinition: 'A range of values that is likely to contain the true population parameter with a specified confidence level.',
    basketballAnalogy: 'Like estimating a player\'s scoring range for a game (e.g., 15-25 points).',
    example: 'A 95% CI of 80-90% efficacy means we\'re 95% confident the true efficacy is between 80-90%.'
  }
};

export function ExplainerTooltip({ 
  term, 
  simpleDefinition, 
  technicalDefinition, 
  example, 
  basketballAnalogy,
  children 
}: ExplainerProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted underline-offset-2 cursor-help">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3" side="top">
          <p className="text-sm font-medium text-emerald-400 mb-1">{term}</p>
          <p className="text-xs text-gray-300">{simpleDefinition}</p>
          {basketballAnalogy && (
            <p className="text-xs text-orange-400 mt-2">🏀 {basketballAnalogy}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ExplainerDialog({ 
  term, 
  simpleDefinition, 
  technicalDefinition, 
  example, 
  basketballAnalogy,
  learnMoreUrl,
  children 
}: ExplainerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300">
          {children}
          <HelpCircle className="w-3 h-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            {term}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Simple Definition */}
          <div>
            <Badge variant="outline" className="mb-2 text-emerald-400 border-emerald-600">
              <Lightbulb className="w-3 h-3 mr-1" />
              Simple Explanation
            </Badge>
            <p className="text-sm text-gray-300">{simpleDefinition}</p>
          </div>
          
          {/* Basketball Analogy */}
          {basketballAnalogy && (
            <div>
              <Badge variant="outline" className="mb-2 text-orange-400 border-orange-600">
                🏀 Basketball Analogy
              </Badge>
              <p className="text-sm text-gray-300">{basketballAnalogy}</p>
            </div>
          )}
          
          {/* Technical Definition */}
          {technicalDefinition && (
            <div>
              <Badge variant="outline" className="mb-2 text-blue-400 border-blue-600">
                <BookOpen className="w-3 h-3 mr-1" />
                Technical Definition
              </Badge>
              <p className="text-sm text-gray-400">{technicalDefinition}</p>
            </div>
          )}
          
          {/* Example */}
          {example && (
            <div>
              <Badge variant="outline" className="mb-2 text-purple-400 border-purple-600">
                Example
              </Badge>
              <p className="text-sm text-gray-300">{example}</p>
            </div>
          )}
          
          {/* Learn More */}
          {learnMoreUrl && (
            <Button variant="outline" className="w-full" asChild>
              <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn More
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick concept explainer card
export function ConceptCard({ concept }: { concept: keyof typeof scienceGlossary }) {
  const info = scienceGlossary[concept];
  if (!info) return null;

  return (
    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
      <div className="flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <div>
          <span className="text-sm font-medium text-blue-400">{info.term}: </span>
          <span className="text-sm text-gray-300">{info.simpleDefinition}</span>
        </div>
      </div>
    </div>
  );
}

// Glossary browser component
export function GlossaryBrowser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const filteredTerms = Object.entries(scienceGlossary).filter(([key, value]) =>
    value.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search terms..."
        className="w-full p-2 rounded bg-[#21262d] border border-[#30363d] text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="space-y-2">
        {filteredTerms.map(([key, value]) => (
          <div
            key={key}
            className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] hover:border-emerald-500/50 cursor-pointer"
            onClick={() => setSelectedTerm(selectedTerm === key ? null : key)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{value.term}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedTerm === key ? 'rotate-90' : ''}`} />
            </div>
            
            {selectedTerm === key && (
              <div className="mt-2 space-y-2 text-xs text-gray-400">
                <p>{value.simpleDefinition}</p>
                {value.basketballAnalogy && (
                  <p className="text-orange-400">🏀 {value.basketballAnalogy}</p>
                )}
                {value.example && (
                  <p className="italic">Example: {value.example}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
