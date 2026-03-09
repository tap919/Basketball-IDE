'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Settings, Server, Zap, Globe, Shield, Database,
  Check, AlertCircle, RefreshCw, ExternalLink
} from 'lucide-react';

interface SettingsPanelProps {
  theme: string;
}

interface LLMConfig {
  provider: 'z-ai' | 'ollama' | 'openai';
  model: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

interface AppConfig {
  llm: LLMConfig;
  dataPath: string;
  cacheEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

const defaultConfig: AppConfig = {
  llm: {
    provider: 'z-ai',
    model: 'default',
    temperature: 0.7,
    maxTokens: 2048,
    enabled: true
  },
  dataPath: '/upload',
  cacheEnabled: true,
  autoRefresh: false,
  refreshInterval: 60
};

export default function SettingsPanel({ theme }: SettingsPanelProps) {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('basketball-ide-config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
          test: true
        })
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch {
      setConnectionStatus('error');
    }
    setTesting(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`p-3 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <h3 className="font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* LLM Configuration */}
          <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                LLM Configuration
              </CardTitle>
              <CardDescription>
                Configure AI model settings for translation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable LLM</label>
                  <p className="text-xs text-gray-500">Use AI for biotech translations</p>
                </div>
                <Switch
                  checked={config.llm.enabled}
                  onCheckedChange={(checked) => 
                    setConfig(c => ({ ...c, llm: { ...c.llm, enabled: checked }}))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Provider</label>
                <select 
                  className={`w-full h-9 px-2 rounded text-sm ${
                    theme === 'dark' ? 'bg-[#0d1117] border-[#30363d]' : 'bg-gray-50 border-gray-200'
                  } border`}
                  value={config.llm.provider}
                  onChange={(e) => setConfig(c => ({ 
                    ...c, 
                    llm: { ...c.llm, provider: e.target.value as LLMConfig['provider'] } 
                  }))}
                >
                  <option value="z-ai">Z-AI (Default)</option>
                  <option value="ollama">Ollama (Local)</option>
                  <option value="openai">OpenAI</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Input
                  value={config.llm.model}
                  onChange={(e) => setConfig(c => ({ 
                    ...c, 
                    llm: { ...c.llm, model: e.target.value } 
                  }))}
                  placeholder="Model name"
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Temperature: {config.llm.temperature}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.llm.temperature}
                  onChange={(e) => setConfig(c => ({ 
                    ...c, 
                    llm: { ...c.llm, temperature: parseFloat(e.target.value) } 
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Tokens</label>
                <Input
                  type="number"
                  value={config.llm.maxTokens}
                  onChange={(e) => setConfig(c => ({ 
                    ...c, 
                    llm: { ...c.llm, maxTokens: parseInt(e.target.value) } 
                  }))}
                  className="h-9"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleTestConnection}
                disabled={testing}
              >
                {testing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : connectionStatus === 'connected' ? (
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                ) : connectionStatus === 'error' ? (
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                ) : (
                  <Server className="w-4 h-4 mr-2" />
                )}
                Test Connection
                {connectionStatus === 'connected' && <Badge className="ml-2 bg-green-600">Connected</Badge>}
                {connectionStatus === 'error' && <Badge className="ml-2 bg-red-600">Error</Badge>}
              </Button>
            </CardContent>
          </Card>
          
          {/* Data Settings */}
          <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                Data Settings
              </CardTitle>
              <CardDescription>
                Configure data source and caching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable Cache</label>
                  <p className="text-xs text-gray-500">Cache API responses</p>
                </div>
                <Switch
                  checked={config.cacheEnabled}
                  onCheckedChange={(checked) => setConfig(c => ({ ...c, cacheEnabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto Refresh</label>
                  <p className="text-xs text-gray-500">Automatically update data</p>
                </div>
                <Switch
                  checked={config.autoRefresh}
                  onCheckedChange={(checked) => setConfig(c => ({ ...c, autoRefresh: checked }))}
                />
              </div>
              
              {config.autoRefresh && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Refresh Interval (seconds)</label>
                  <Input
                    type="number"
                    value={config.refreshInterval}
                    onChange={(e) => setConfig(c => ({ ...c, refreshInterval: parseInt(e.target.value) }))}
                    className="h-9"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* About */}
          <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Version</span>
                <Badge variant="outline">1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Data Source</span>
                <span>NBA Stats 2010-2024</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Translation Layer</span>
                <span>12 Biotech Analogies</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Globe className="w-4 h-4 mr-2" />
                Documentation
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
          
          {/* Save Button */}
          <Button 
            className="w-full" 
            onClick={handleSave}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
