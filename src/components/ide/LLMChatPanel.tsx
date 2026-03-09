'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, Bot, User, Loader2, Copy, Check, RefreshCw,
  Settings, Code, Database, AlertCircle, Wifi, WifiOff
} from 'lucide-react';

interface LLMChatPanelProps {
  theme: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  translated?: boolean;
  error?: boolean;
}

interface ChatRequest {
  messages: { role: string; content: string }[];
  stream?: boolean;
}

const SYSTEM_PROMPT = `You are an expert at translating basketball statistics into biotech research analogies. 
Your role is to help researchers understand statistical concepts from sports analytics and map them to 
pharmaceutical and biotech research contexts.

Key mappings you should know:
- Field Goal % → Transfection Efficiency
- Three-Point % → Specificity Ratio
- Assists → Synergistic Drug Interactions
- Rebounds → Recapture Rate
- Turnovers → Adverse Events
- Plus/Minus → Therapeutic Index
- Points Per Game → Bioavailability

Always provide:
1. The biotech equivalent concept
2. A clear explanation of the analogy
3. How the statistical measure translates
4. Potential applications in research`;

export default function LLMChatPanel({ theme }: LLMChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to the Basketball-to-Biotech translation assistant. I can help you translate NBA statistics into biotech research concepts. Try asking me to "translate FG%" or "compare team stats to clinical outcomes".',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [llmStatus, setLlmStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check LLM service availability
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build message history for context (last 10 messages for efficiency)
      const conversationHistory = messages
        .filter(m => m.role !== 'system' || m.id === '1') // Keep only the welcome system message
        .slice(-10)
        .map(m => ({ role: m.role === 'system' ? 'user' : m.role, content: m.content }));
      
      // Add the new user message
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
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'I apologize, but I was unable to generate a response.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('LLM Chat Error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error processing your request. This could be due to:\n\n1. The AI service being temporarily unavailable\n2. Network connectivity issues\n3. Rate limiting\n\nPlease try again in a moment. Error: ${error.message || 'Unknown error'}`,
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
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage && !isLoading) {
      // Remove the last assistant message
      setMessages(prev => prev.slice(0, -1));
      // Re-send the last user message
      setInput(lastUserMessage.content);
      setTimeout(() => {
        handleSend();
      }, 100);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'system',
        content: 'Conversation cleared. How can I help you with basketball-to-biotech translations?',
        timestamp: new Date()
      }
    ]);
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
                      <Database className="w-3 h-3 mr-1" />
                      Biotech Translator
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
                      // Code block
                      return (
                        <pre key={i} className="bg-[#0d1117] p-2 rounded text-xs overflow-x-auto my-2">
                          <code>{part}</code>
                        </pre>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>
                
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
            placeholder="Ask about basketball-to-biotech translation..."
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
