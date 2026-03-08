'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowRightLeft, Dna, CircleDot, Info, Sparkles, 
  Calculator, FlaskConical, TrendingUp, Zap 
} from 'lucide-react';
import { basketballBiotechAnalogies, translateStatToBiotech } from '@/lib/translation/analogies';

interface TranslationPanelProps {
  theme: string;
}

export default function TranslationPanel({ theme }: TranslationPanelProps) {
  const [selectedAnalogy, setSelectedAnalogy] = useState(0);
  const [inputStat, setInputStat] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [translation, setTranslation] = useState<ReturnType<typeof translateStatToBiotech> | null>(null);

  const handleTranslate = () => {
    if (inputStat && inputValue) {
      const result = translateStatToBiotech(inputStat, parseFloat(inputValue));
      setTranslation(result);
    }
  };

  return (
    <div className="h-full flex">
      {/* Analogies List */}
      <div className="w-1/2 border-r border-[#30363d] flex flex-col">
        <div className="p-3 border-b border-[#30363d]">
          <h3 className="font-semibold flex items-center gap-2">
            <Dna className="w-4 h-4 text-emerald-500" />
            Biotech Analogies
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Mapping basketball metrics to biotech concepts
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {basketballBiotechAnalogies.map((analogy, index) => (
              <button
                key={analogy.basketballTerm}
                className={`w-full text-left p-2 rounded transition-colors ${
                  selectedAnalogy === index 
                    ? 'bg-[#21262d] border border-[#30363d]' 
                    : 'hover:bg-[#161b22]'
                }`}
                onClick={() => setSelectedAnalogy(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleDot className="w-3 h-3 text-orange-500" />
                    <span className="text-sm font-medium truncate">
                      {analogy.basketballTerm.split('(')[0].trim()}
                    </span>
                  </div>
                  <ArrowRightLeft className="w-3 h-3 text-gray-500" />
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Dna className="w-3 h-3 text-emerald-500" />
                  <span className="truncate">{analogy.biotechEquivalent}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Selected Analogy Detail */}
      <div className="w-1/2 flex flex-col">
        <div className="p-3 border-b border-[#30363d]">
          <h3 className="font-semibold">Analogy Details</h3>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {basketballBiotechAnalogies[selectedAnalogy] && (
              <>
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CircleDot className="w-5 h-5 text-orange-500" />
                      {basketballBiotechAnalogies[selectedAnalogy].basketballTerm}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center my-2">
                      <ArrowRightLeft className="w-8 h-8 text-gray-500" />
                    </div>
                    <CardTitle className="text-base flex items-center justify-center gap-2">
                      <Dna className="w-5 h-5 text-emerald-500" />
                      {basketballBiotechAnalogies[selectedAnalogy].biotechEquivalent}
                    </CardTitle>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      {basketballBiotechAnalogies[selectedAnalogy].description}
                    </p>
                  </CardContent>
                </Card>
                
                {basketballBiotechAnalogies[selectedAnalogy].formula && (
                  <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Formula
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <code className="text-sm text-emerald-400 bg-[#0d1117] p-2 rounded block">
                        {basketballBiotechAnalogies[selectedAnalogy].formula}
                      </code>
                    </CardContent>
                  </Card>
                )}
                
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Significance Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#0d1117] rounded overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500"
                          style={{ width: `${basketballBiotechAnalogies[selectedAnalogy].significanceScore * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {(basketballBiotechAnalogies[selectedAnalogy].significanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Quick Translator */}
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Quick Translator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <select 
                  className="w-full h-9 bg-[#0d1117] border border-[#30363d] rounded px-2 text-sm"
                  value={inputStat}
                  onChange={(e) => setInputStat(e.target.value)}
                >
                  <option value="">Select a stat...</option>
                  <option value="FG_PCT">FG%</option>
                  <option value="FG3_PCT">3P%</option>
                  <option value="AST">Assists</option>
                  <option value="REB">Rebounds</option>
                  <option value="TOV">Turnovers</option>
                  <option value="PTS">Points</option>
                </select>
                
                <Input
                  placeholder="Enter value..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type="number"
                />
                
                <Button 
                  className="w-full"
                  onClick={handleTranslate}
                  disabled={!inputStat || !inputValue}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Translate
                </Button>
                
                {translation && (
                  <div className="p-3 bg-[#0d1117] rounded border border-[#30363d]">
                    <div className="text-xs text-gray-500 mb-1">Result:</div>
                    <div className="text-sm">
                      <span className="text-orange-400">{translation.original.stat}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span className="text-emerald-400">{translation.translated.concept}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {translation.translated.interpretation}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
