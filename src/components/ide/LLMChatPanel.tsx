'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, Bot, User, Loader2, Copy, Check, RefreshCw,
  Settings, Code, Database, AlertCircle, Wifi, WifiOff,
  Play, List, Zap, Dna, Heart, Brain, Target, Rocket,
  Sparkles, Activity, Bug
} from 'lucide-react';
import { pipelineTemplates, experimentCategories, getBreakthroughPotential } from '@/lib/pipeline/templates';

interface LLMChatPanelProps {
  theme: string;
  onRunPipeline?: (templateId: string) => void;
  onSelectCategory?: (category: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  translated?: boolean;
  error?: boolean;
  hasAction?: boolean;
  actionType?: 'run-pipeline' | 'show-category';
  actionData?: string;
}

interface ChatRequest {
  messages: { role: string; content: string }[];
  stream?: boolean;
}

const SYSTEM_PROMPT = `You are an expert medical research assistant specializing in translating basketball statistics into biotech research breakthroughs for disease cures.

Your mission is to help researchers:
1. Understand how basketball analytics concepts map to disease cure research
2. Navigate and run simulation pipelines for medical breakthroughs
3. Design experiments targeting cures for diseases like Alzheimer's, cancer, and genetic disorders
4. Translate basketball teamwork concepts into combination therapy strategies

Key basketball-to-biotech mappings for disease cures:
- Field Goal % → Therapeutic Efficiency (drug target hit rate)
- Assists → Combination Therapy Synergy (multi-drug coordination)  
- Rebounds → Disease Recurrence Prevention (sustained remission)
- Turnovers → Adverse Events (treatment complications)
- Plus/Minus → Therapeutic Index (benefit vs risk ratio)
- Player Development → Gene Therapy Optimization
- Team Chemistry → Drug Combination Compatibility
- Clutch Performance → Breakthrough Treatment Potential

Available breakthrough research pipelines:
- Alzheimer's Disease Reversal (multi-target cognitive restoration)
- CAR-T Cell Therapy for Solid Tumors (cancer immunotherapy)
- Universal Virus Vaccine Design (pandemic prevention)
- CRISPR Gene Cure Designer (one-time genetic disease cures)
- Digital Twin Therapy Optimization (personalized medicine)
- Organ Regeneration Protocol (lab-grown organs)
- Parkinson's Disease Reversal (motor function restoration)
- Rare Disease Treatment Discovery (orphan disease cures)

When users express interest in:
- "cure [disease]" → Recommend appropriate pipeline
- "vaccine" or "virus" → Suggest viral research pipelines
- "gene therapy" or "CRISPR" → Recommend gene therapy pipelines
- "cancer" → Suggest oncology research pipelines
- "brain" or "neuro" → Recommend neurodegenerative pipelines

Always provide actionable, scientifically-grounded guidance for achieving medical breakthroughs.`;

const quickActions = [
  { label: 'Cure Alzheimer\'s', icon: Brain, templateId: 'alzheimer-reversal' },
  { label: 'Design Gene Cure', icon: Dna, templateId: 'crispr-cure-design' },
  { label: 'Cancer Immunotherapy', icon: Target, templateId: 'cancer-immunotherapy' },
  { label: 'Universal Vaccine', icon: Bug, templateId: 'universal-vaccine' },
];

export default function LLMChatPanel({ theme, onRunPipeline, onSelectCategory }: LLMChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: '🧬 Welcome to the Disease Cure Research Assistant.\n\nI can help you run experiments and simulations for:\n\n• **Curing Diseases** - Alzheimer\'s, Parkinson\'s, Cancer\n• **Gene Therapy** - CRISPR cures for genetic diseases\n• **Virus Research** - Universal vaccines, antivirals\n• **Personalized Medicine** - Digital twin therapy\n• **Rare Diseases** - Orphan disease treatments\n\nTry asking me to "cure Alzheimer\'s" or "design a gene therapy for sickle cell".',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [llmStatus, setLlmStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkLLMStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/llm/chat');
      const data = await response.json();
      setLlmStatus(data.status === 'available' ? 'available' : 'unavailable');
    } catch {
      setLlmStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    checkLLMStatus();
  }, [checkLLMStatus]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Parse user input for medical research commands
  const parsePipelineCommand = (input: string): { templateId: string | null; categoryName: string | null; diseaseHint: string | null } => {
    const lowerInput = input.toLowerCase();
    
    // Disease keywords mapping
    const diseaseKeywords: Record<string, string> = {
      'alzheimer': 'alzheimer-reversal',
      'dementia': 'alzheimer-reversal',
      'cognitive': 'alzheimer-reversal',
      'parkinson': 'parkinsons-reversal',
      'cancer': 'cancer-immunotherapy',
      'tumor': 'cancer-immunotherapy',
      'car-t': 'cancer-immunotherapy',
      'immunotherapy': 'cancer-immunotherapy',
      'vaccine': 'universal-vaccine',
      'virus': 'universal-vaccine',
      'pandemic': 'universal-vaccine',
      'antiviral': 'antiviral-discovery',
      'crispr': 'crispr-cure-design',
      'gene therapy': 'crispr-cure-design',
      'gene editing': 'crispr-cure-design',
      'sickle cell': 'crispr-cure-design',
      'genetic': 'crispr-cure-design',
      'digital twin': 'digital-twin-therapy',
      'personalized': 'digital-twin-therapy',
      'organ': 'organ-regeneration',
      'transplant': 'organ-regeneration',
      'rare disease': 'rare-disease-nlp',
      'orphan': 'rare-disease-nlp',
      'variant': 'rare-variant-interpreter',
      'vus': 'rare-variant-interpreter'
    };
    
    // Check for explicit pipeline commands
    if (lowerInput.includes('run') || lowerInput.includes('start') || lowerInput.includes('execute') || lowerInput.includes('simulate') || lowerInput.includes('cure') || lowerInput.includes('design') || lowerInput.includes('create')) {
      for (const [keyword, templateId] of Object.entries(diseaseKeywords)) {
        if (lowerInput.includes(keyword)) {
          return { templateId, categoryName: null, diseaseHint: keyword };
        }
      }
      
      // Check category keywords
      if (lowerInput.includes('gene') || lowerInput.includes('genetic')) {
        return { templateId: 'crispr-cure-design', categoryName: 'gene-therapy', diseaseHint: 'gene therapy' };
      }
      if (lowerInput.includes('virus') || lowerInput.includes('viral')) {
        return { templateId: 'universal-vaccine', categoryName: 'virus-mutation', diseaseHint: 'viral' };
      }
      if (lowerInput.includes('brain') || lowerInput.includes('neuro')) {
        return { templateId: 'alzheimer-reversal', categoryName: 'neurodegenerative', diseaseHint: 'neurological' };
      }
    }
    
    return { templateId: null, categoryName: null, diseaseHint: null };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const { templateId, categoryName, diseaseHint } = parsePipelineCommand(input);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      hasAction: !!templateId || !!categoryName,
      actionType: templateId ? 'run-pipeline' : categoryName ? 'show-category' : undefined,
      actionData: templateId || categoryName || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter(m => m.role !== 'system' || m.id === '1')
        .slice(-10)
        .map(m => ({ role: m.role === 'system' ? 'user' : m.role, content: m.content }));
      
      conversationHistory.push({ role: 'user', content: input });

      const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: conversationHistory,
          stream: false 
        } as ChatRequest)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      let content = data.content || 'I apologize, but I was unable to generate a response.';
      
      // If there's a pipeline match, append action information
      if (templateId) {
        const template = pipelineTemplates.find(t => t.id === templateId);
        const breakthrough = getBreakthroughPotential(templateId);
        if (template) {
          content += `\n\n---\n\n🎯 **Ready to run: ${template.name}**\n\n💡 **Breakthrough Potential:** ${breakthrough.breakthrough}\n\nClick the action button below to start this experiment.`;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        hasAction: !!templateId || !!categoryName,
        actionType: templateId ? 'run-pipeline' : categoryName ? 'show-category' : undefined,
        actionData: templateId || categoryName || undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('LLM Chat Error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I encountered an error, but I can still help you with disease cure research.\n\nTry using the quick action buttons below to start a breakthrough experiment pipeline.`,
        timestamp: new Date(),
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage && !isLoading) {
      setMessages(prev => prev.slice(0, -1));
      setInput(lastUserMessage.content);
      setTimeout(() => handleSend(), 100);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'system',
        content: '🧬 Conversation cleared. Ready to work on disease cures and breakthrough research!\n\nWhat disease or medical challenge would you like to tackle?',
        timestamp: new Date()
      }
    ]);
  };

  const handleActionClick = (message: Message) => {
    if (message.actionType === 'run-pipeline' && message.actionData && onRunPipeline) {
      onRunPipeline(message.actionData);
    } else if (message.actionType === 'show-category' && message.actionData && onSelectCategory) {
      onSelectCategory(message.actionData);
    }
  };

  const handleQuickAction = (templateId: string) => {
    const template = pipelineTemplates.find(t => t.id === templateId);
    if (template) {
      setInput(`Run ${template.name}`);
      setTimeout(handleSend, 100);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 text-xs border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          {llmStatus === 'checking' && (
            <Badge variant="secondary" className="text-xs">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Checking...
            </Badge>
          )}
          {llmStatus === 'available' && (
            <Badge variant="outline" className="text-xs text-green-400 border-green-600">
              <Wifi className="w-3 h-3 mr-1" /> AI Connected
            </Badge>
          )}
          {llmStatus === 'unavailable' && (
            <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-600">
              <WifiOff className="w-3 h-3 mr-1" /> AI Offline
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={checkLLMStatus}>
          <RefreshCw className="w-3 h-3 mr-1" /> Check
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.role === 'system'
                    ? 'bg-[#21262d] border border-[#30363d]'
                    : message.error
                    ? 'bg-[#2d1f1f] border border-red-800'
                    : 'bg-[#161b22] border border-[#30363d]'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      <Rocket className="w-3 h-3 mr-1" />
                      Research Assistant
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(message.content, message.id)}
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                )}
                
                <div className="text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                  {message.content.split('```').map((part, i) => {
                    if (i % 2 === 1) {
                      return (
                        <pre key={i} className="bg-[#0d1117] p-2 rounded text-xs overflow-x-auto my-2">
                          <code>{part}</code>
                        </pre>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>
                
                {/* Action Button */}
                {message.hasAction && message.actionData && (
                  <div className="mt-3 pt-2 border-t border-[#30363d]">
                    <Button 
                      size="sm" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleActionClick(message)}
                    >
                      {message.actionType === 'run-pipeline' ? (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Run Experiment Pipeline
                        </>
                      ) : (
                        <>
                          <List className="w-3 h-3 mr-1" />
                          Show Category
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span className="text-sm text-gray-400">Analyzing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Quick Actions */}
      <div className="px-3 py-2 border-t border-[#30363d]">
        <div className="text-xs text-gray-500 mb-2">Quick Actions:</div>
        <div className="flex gap-1 flex-wrap">
          {quickActions.map(action => (
            <Button 
              key={action.templateId}
              variant="outline" 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => handleQuickAction(action.templateId)}
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-2 border-t border-[#30363d]">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about disease cures, gene therapy, or run an experiment..."
            className="flex-1 h-9"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        
        <div className="flex items-center gap-1 mt-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <Code className="w-3 h-3 mr-1" /> Code
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={handleRegenerate}
            disabled={isLoading || messages.length < 2}
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearConversation}>
            <Settings className="w-3 h-3 mr-1" /> Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
