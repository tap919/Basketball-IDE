'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users, Trophy, Star, Zap, Target, FlaskConical, Heart,
  Brain, Dna, Award, Clock, TrendingUp, Medal, Crown,
  Sparkles, Gift, CheckCircle2
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  progress?: number;
  total?: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'research' | 'collaboration' | 'innovation' | 'impact';
}

interface Researcher {
  id: string;
  name: string;
  expertise: string[];
  contributions: number;
  reputation: number;
  achievements: string[];
  activeProjects: string[];
}

interface LeaderboardEntry {
  rank: number;
  researcher: Researcher;
  score: number;
  trend: 'up' | 'down' | 'same';
}

const achievements: Achievement[] = [
  {
    id: 'first-experiment',
    name: 'First Steps',
    description: 'Complete your first experiment',
    icon: '🔬',
    tier: 'bronze',
    category: 'research',
    earnedAt: new Date(),
  },
  {
    id: 'hypothesis-generator',
    name: 'Hypothesis Generator',
    description: 'Generate 10 AI-powered hypotheses',
    icon: '💡',
    tier: 'silver',
    category: 'innovation',
    progress: 7,
    total: 10
  },
  {
    id: 'collaborator',
    name: 'Team Player',
    description: 'Collaborate on 5 projects',
    icon: '🤝',
    tier: 'silver',
    category: 'collaboration',
    progress: 3,
    total: 5
  },
  {
    id: 'breakthrough',
    name: 'Breakthrough Hunter',
    description: 'Identify a high-impact research target',
    icon: '🎯',
    tier: 'gold',
    category: 'impact',
    earnedAt: new Date(Date.now() - 86400000 * 7)
  },
  {
    id: 'alzheimer-contributor',
    name: "Alzheimer's Advocate",
    description: 'Contribute to Alzheimer\'s disease research',
    icon: '🧠',
    tier: 'silver',
    category: 'research',
    progress: 60,
    total: 100
  },
  {
    id: 'gene-therapy-pioneer',
    name: 'Gene Therapy Pioneer',
    description: 'Complete 3 gene therapy experiments',
    icon: '🧬',
    tier: 'gold',
    category: 'research',
    progress: 2,
    total: 3
  },
  {
    id: 'peer-reviewer',
    name: 'Peer Reviewer',
    description: 'Review 10 research submissions',
    icon: '📝',
    tier: 'platinum',
    category: 'collaboration',
    progress: 4,
    total: 10
  },
  {
    id: 'cancer-crusader',
    name: 'Cancer Crusader',
    description: 'Contribute to cancer research breakthrough',
    icon: '🎗️',
    tier: 'gold',
    category: 'impact',
    progress: 85,
    total: 100
  }
];

const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    researcher: {
      id: 'u1',
      name: 'Sarah Chen',
      expertise: ['CRISPR', 'Gene Therapy', 'Oncology'],
      contributions: 247,
      reputation: 98,
      achievements: ['breakthrough', 'gene-therapy-pioneer'],
      activeProjects: ['CRISPR-Cure-Design', 'CAR-T-Optimization']
    },
    score: 12500,
    trend: 'up'
  },
  {
    rank: 2,
    researcher: {
      id: 'u2',
      name: 'Michael Rodriguez',
      expertise: ['Neurodegeneration', 'Biomarkers', 'AI/ML'],
      contributions: 189,
      reputation: 94,
      achievements: ['alzheimer-contributor', 'hypothesis-generator'],
      activeProjects: ['Alzheimer-Reversal', 'Digital-Twin']
    },
    score: 10800,
    trend: 'same'
  },
  {
    rank: 3,
    researcher: {
      id: 'u3',
      name: 'Emily Watson',
      expertise: ['Virology', 'Vaccines', 'Epidemiology'],
      contributions: 156,
      reputation: 91,
      achievements: ['first-experiment', 'collaborator'],
      activeProjects: ['Universal-Vaccine', 'Antiviral-Discovery']
    },
    score: 9200,
    trend: 'up'
  }
];

const activeProjects = [
  {
    id: 'p1',
    name: 'Alzheimer\'s Disease Reversal',
    participants: 12,
    progress: 68,
    status: 'active',
    category: 'Disease Cure'
  },
  {
    id: 'p2',
    name: 'CRISPR Gene Cure Designer',
    participants: 8,
    progress: 45,
    status: 'active',
    category: 'Gene Therapy'
  },
  {
    id: 'p3',
    name: 'Universal Vaccine Design',
    participants: 15,
    progress: 32,
    status: 'recruiting',
    category: 'Virus Research'
  }
];

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600'
};

export default function ResearchHub() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'projects' | 'leaderboard'>('achievements');

  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      {/* Header */}
      <div className="p-3 border-b border-[#30363d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="font-medium">Research Hub</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600">
              <Star className="w-3 h-3 mr-1" />
              Level 12 Scientist
            </Badge>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {(['achievements', 'projects', 'leaderboard'] as const).map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              className={activeTab === tab ? 'bg-purple-600' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'achievements' && <Trophy className="w-3 h-3 mr-1" />}
              {tab === 'projects' && <FlaskConical className="w-3 h-3 mr-1" />}
              {tab === 'leaderboard' && <Medal className="w-3 h-3 mr-1" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-[#161b22] rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-400">4</div>
                <div className="text-xs text-gray-500">Earned</div>
              </div>
              <div className="p-3 bg-[#161b22] rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-400">4</div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              <div className="p-3 bg-[#161b22] rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">2,450</div>
                <div className="text-xs text-gray-500">XP Earned</div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid gap-3">
              {achievements.map(achievement => {
                const isEarned = !!achievement.earnedAt;
                const progressPercent = achievement.progress !== undefined 
                  ? (achievement.progress / (achievement.total || 1)) * 100 
                  : 0;
                
                return (
                  <Card 
                    key={achievement.id}
                    className={`bg-[#161b22] border-[#30363d] ${isEarned ? 'border-emerald-500/30' : ''}`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tierColors[achievement.tier]} flex items-center justify-center text-xl ${!isEarned ? 'opacity-50' : ''}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-sm">{achievement.name}</span>
                              {isEarned && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline ml-2" />}
                            </div>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {achievement.tier}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{achievement.description}</p>
                          
                          {achievement.progress !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                <span>{achievement.progress}/{achievement.total}</span>
                                <span>{Math.round(progressPercent)}%</span>
                              </div>
                              <Progress value={progressPercent} className="h-1.5" />
                            </div>
                          )}
                          
                          {isEarned && (
                            <p className="text-[10px] text-emerald-400 mt-2">
                              Earned {achievement.earnedAt?.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Join a Research Team</span>
              </div>
              <p className="text-xs text-gray-400">Collaborate with other citizen scientists on breakthrough research</p>
            </div>

            {activeProjects.map(project => (
              <Card key={project.id} className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm">{project.name}</span>
                      <Badge variant="outline" className="ml-2 text-[10px]">{project.category}</Badge>
                    </div>
                    <Badge className={project.status === 'active' ? 'bg-emerald-600' : 'bg-blue-600'}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project.participants} researchers
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-400">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    {project.status === 'recruiting' ? 'Join Project' : 'View Details'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-3">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/30">
              <Crown className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
              <p className="text-sm font-medium">Top Citizen Scientists</p>
              <p className="text-xs text-gray-500">This month's breakthrough contributors</p>
            </div>

            {leaderboard.map(entry => (
              <Card key={entry.researcher.id} className={`bg-[#161b22] ${
                entry.rank === 1 ? 'border-yellow-500/50' :
                entry.rank === 2 ? 'border-gray-400/50' :
                entry.rank === 3 ? 'border-amber-600/50' :
                'border-[#30363d]'
              }`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-[#21262d] text-gray-400'
                    }`}>
                      {entry.rank}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-purple-600">
                        {entry.researcher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="font-medium text-sm">{entry.researcher.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{entry.researcher.contributions} contributions</span>
                        {entry.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-purple-400">{entry.score.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500">points</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.researcher.expertise.slice(0, 3).map(exp => (
                      <Badge key={exp} variant="secondary" className="text-[10px]">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
