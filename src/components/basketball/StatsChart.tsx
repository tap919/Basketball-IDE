'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface StatsChartProps {
  season: string;
  theme: string;
}

interface SeasonTrend {
  season: string;
  totalGames: number;
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
  avgFG_PCT: number;
  avgFG3_PCT: number;
  avgFT_PCT: number;
  avgTOV: number;
  avgSTL: number;
  avgBLK: number;
  avgPlusMinus: number;
}

interface TeamStats {
  teamId: number;
  teamName: string;
  teamAbbr: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winPct: number;
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
}

export default function StatsChart({ season, theme }: StatsChartProps) {
  const [chartType, setChartType] = useState('trend');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<SeasonTrend[]>([]);
  const [teamData, setTeamData] = useState<TeamStats[]>([]);
  const [dataType, setDataType] = useState<'regular' | 'playoffs'>('regular');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch trend data
      const trendsResponse = await fetch(`/api/nba/trends?type=${dataType}`);
      if (!trendsResponse.ok) throw new Error('Failed to fetch trends');
      const trendsData = await trendsResponse.json();
      setTrendData(trendsData.trends);

      // Fetch team data for comparison
      const teamsResponse = await fetch(`/api/nba/teams?season=${season}&type=${dataType}`);
      if (!teamsResponse.ok) throw new Error('Failed to fetch team data');
      const teamsData = await teamsResponse.json();
      setTeamData(teamsData.teams.slice(0, 5)); // Top 5 teams
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  }, [season, dataType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Prepare team comparison data
  const teamComparisonData = teamData.map(team => ({
    name: team.teamAbbr,
    pts: Math.round(team.avgPoints * 10) / 10,
    reb: Math.round(team.avgRebounds * 10) / 10,
    ast: Math.round(team.avgAssists * 10) / 10,
    stl: 0,
    blk: 0
  }));

  // Prepare radar data for the top team
  const radarData = teamData.length > 0 ? [
    { stat: 'Scoring', value: Math.min(100, (teamData[0].avgPoints / 130) * 100) },
    { stat: 'Rebounding', value: Math.min(100, (teamData[0].avgRebounds / 50) * 100) },
    { stat: 'Assists', value: Math.min(100, (teamData[0].avgAssists / 35) * 100) },
    { stat: 'Win Rate', value: teamData[0].winPct * 100 },
    { stat: 'Efficiency', value: Math.min(100, teamData[0].winPct * 100 + 10) },
    { stat: 'Defense', value: Math.min(100, 100 - (teamData[0].avgPoints / 130) * 30) },
  ] : [];

  if (loading && trendData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <span className="text-gray-400">Loading chart data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center p-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <span className="text-red-400">{error}</span>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Select value={dataType} onValueChange={(v) => setDataType(v as 'regular' | 'playoffs')}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular Season</SelectItem>
              <SelectItem value="playoffs">Playoffs</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary">{season}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchData}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="trend" className="h-[calc(100%-60px)] flex flex-col">
        <TabsList className="bg-[#161b22]">
          <TabsTrigger value="trend">Season Trends</TabsTrigger>
          <TabsTrigger value="comparison">Team Comparison</TabsTrigger>
          <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trend" className="flex-1 mt-4">
          <Card className="h-full bg-[#161b22] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-lg">
                League Average Trends ({trendData[0]?.season || '2010'} - {trendData[trendData.length - 1]?.season || '2024'})
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="season" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#21262d', border: '1px solid #30363d' }}
                      formatter={(value: number) => value.toFixed(1)}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="avgPoints" name="Avg Points" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="avgRebounds" name="Avg Rebounds" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="avgAssists" name="Avg Assists" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No trend data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="flex-1 mt-4">
          <Card className="h-full bg-[#161b22] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-lg">Top 5 Teams Comparison - {season}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              {teamComparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#21262d', border: '1px solid #30363d' }}
                      formatter={(value: number) => value.toFixed(1)}
                    />
                    <Legend />
                    <Bar dataKey="pts" name="PPG" fill="#ef4444" />
                    <Bar dataKey="reb" name="RPG" fill="#3b82f6" />
                    <Bar dataKey="ast" name="APG" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No team data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="radar" className="flex-1 mt-4">
          <Card className="h-full bg-[#161b22] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-lg">
                {teamData[0]?.teamName || 'Top Team'} - Statistical Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#30363d" />
                    <PolarAngleAxis dataKey="stat" stroke="#6b7280" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#21262d', border: '1px solid #30363d' }}
                      formatter={(value: number) => value.toFixed(1)}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No radar data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
