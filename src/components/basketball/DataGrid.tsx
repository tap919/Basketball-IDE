'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Filter, Download, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataGridProps {
  season: string;
  theme: string;
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

interface ApiResponse {
  teams: TeamStats[];
  season: string;
  type: string;
  availableSeasons: {
    regular: string[];
    playoffs: string[];
  };
  totalTeams: number;
}

export default function DataGrid({ season, theme }: DataGridProps) {
  const [sortColumn, setSortColumn] = useState<string>('winPct');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataType, setDataType] = useState<'regular' | 'playoffs'>('regular');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/nba/teams?season=${season}&type=${dataType}&sortBy=${sortColumn}&sortOrder=${sortDirection}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
      
      const data: ApiResponse = await response.json();
      setTeams(data.teams);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  }, [season, dataType, sortColumn, sortDirection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a: any, b: any) => {
      const aVal = a[sortColumn] ?? 0;
      const bVal = b[sortColumn] ?? 0;
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [teams, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const exportData = () => {
    const headers = ['Team', 'GP', 'W', 'L', 'W%', 'PPG', 'RPG', 'APG'];
    const rows = sortedTeams.map(t => 
      [t.teamName, t.gamesPlayed, t.wins, t.losses, t.winPct.toFixed(3), t.avgPoints.toFixed(1), t.avgRebounds.toFixed(1), t.avgAssists.toFixed(1)]
    );
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nba-teams-${season}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (loading && teams.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <span className="text-gray-400">Loading team statistics...</span>
        </div>
      </div>
    );
  }

  // Error state
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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{season} Season</Badge>
          <Select value={dataType} onValueChange={(v) => setDataType(v as 'regular' | 'playoffs')}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular Season</SelectItem>
              <SelectItem value="playoffs">Playoffs</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">
            {sortedTeams.length} Teams • {dataType === 'regular' ? 'Regular Season' : 'Playoffs'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchData}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {[
                { key: 'teamName', label: 'Team' },
                { key: 'gamesPlayed', label: 'GP' },
                { key: 'wins', label: 'W' },
                { key: 'losses', label: 'L' },
                { key: 'winPct', label: 'W%' },
                { key: 'avgPoints', label: 'PPG' },
                { key: 'avgRebounds', label: 'RPG' },
                { key: 'avgAssists', label: 'APG' },
              ].map(col => (
                <TableHead 
                  key={col.key}
                  className="cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortColumn === col.key && (
                      <ArrowUpDown className={`w-3 h-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No data available for this season
                </TableCell>
              </TableRow>
            ) : (
              sortedTeams.map((team, i) => (
                <TableRow key={team.teamId} className="hover:bg-[#161b22]">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-4">{i + 1}</span>
                      <span className="text-gray-400 text-xs w-8">{team.teamAbbr}</span>
                      <span>{team.teamName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{team.gamesPlayed}</TableCell>
                  <TableCell className="text-green-500">{team.wins}</TableCell>
                  <TableCell className="text-red-500">{team.losses}</TableCell>
                  <TableCell>
                    <Badge variant={team.winPct > 0.6 ? 'default' : 'secondary'}>
                      {team.winPct.toFixed(3)}
                    </Badge>
                  </TableCell>
                  <TableCell>{team.avgPoints.toFixed(1)}</TableCell>
                  <TableCell>{team.avgRebounds.toFixed(1)}</TableCell>
                  <TableCell>{team.avgAssists.toFixed(1)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
