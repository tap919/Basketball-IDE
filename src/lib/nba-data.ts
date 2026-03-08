import { NBAGameStats, TeamStats, SeasonComparison } from '@/types/basketball';

export async function parseCSVFile(content: string): Promise<NBAGameStats[]> {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const record: Record<string, string | number> = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      const numValue = parseFloat(value);
      record[header.trim()] = isNaN(numValue) ? value : numValue;
    });
    
    return record as unknown as NBAGameStats;
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function aggregateTeamStats(games: NBAGameStats[]): TeamStats[] {
  const teamMap = new Map<number, {
    name: string;
    abbr: string;
    games: NBAGameStats[];
  }>();
  
  games.forEach(game => {
    if (!teamMap.has(game.TEAM_ID)) {
      teamMap.set(game.TEAM_ID, {
        name: game.TEAM_NAME,
        abbr: game.TEAM_ABBREVIATION,
        games: []
      });
    }
    teamMap.get(game.TEAM_ID)!.games.push(game);
  });
  
  return Array.from(teamMap.entries()).map(([teamId, data]) => {
    const wins = data.games.filter(g => g.WL === 'W').length;
    const losses = data.games.filter(g => g.WL === 'L').length;
    const totalGames = data.games.length;
    
    return {
      teamId,
      teamName: data.name,
      teamAbbr: data.abbr,
      gamesPlayed: totalGames,
      wins,
      losses,
      winPct: totalGames > 0 ? wins / totalGames : 0,
      avgPoints: totalGames > 0 ? data.games.reduce((sum, g) => sum + g.PTS, 0) / totalGames : 0,
      avgRebounds: totalGames > 0 ? data.games.reduce((sum, g) => sum + g.REB, 0) / totalGames : 0,
      avgAssists: totalGames > 0 ? data.games.reduce((sum, g) => sum + g.AST, 0) / totalGames : 0
    };
  }).sort((a, b) => b.winPct - a.winPct);
}

export function getSeasonComparisons(
  regularSeasonGames: NBAGameStats[],
  playoffGames: NBAGameStats[]
): SeasonComparison[] {
  const seasonMap = new Map<string, {
    regular: NBAGameStats[];
    playoff: NBAGameStats[];
  }>();
  
  regularSeasonGames.forEach(game => {
    const season = game.SEASON_YEAR;
    if (!seasonMap.has(season)) {
      seasonMap.set(season, { regular: [], playoff: [] });
    }
    seasonMap.get(season)!.regular.push(game);
  });
  
  playoffGames.forEach(game => {
    const season = game.SEASON_YEAR;
    if (!seasonMap.has(season)) {
      seasonMap.set(season, { regular: [], playoff: [] });
    }
    seasonMap.get(season)!.playoff.push(game);
  });
  
  return Array.from(seasonMap.entries())
    .map(([season, data]) => ({
      season,
      regularSeason: {
        totalGames: data.regular.length,
        avgPoints: data.regular.length > 0 
          ? data.regular.reduce((sum, g) => sum + g.PTS, 0) / data.regular.length 
          : 0,
        avgRebounds: data.regular.length > 0 
          ? data.regular.reduce((sum, g) => sum + g.REB, 0) / data.regular.length 
          : 0
      },
      playoffs: {
        totalGames: data.playoff.length,
        avgPoints: data.playoff.length > 0 
          ? data.playoff.reduce((sum, g) => sum + g.PTS, 0) / data.playoff.length 
          : 0,
        avgRebounds: data.playoff.length > 0 
          ? data.playoff.reduce((sum, g) => sum + g.REB, 0) / data.playoff.length 
          : 0
      }
    }))
    .sort((a, b) => a.season.localeCompare(b.season));
}

export const STAT_CATEGORIES = [
  { key: 'PTS', label: 'Points', color: '#ef4444' },
  { key: 'REB', label: 'Rebounds', color: '#3b82f6' },
  { key: 'AST', label: 'Assists', color: '#22c55e' },
  { key: 'STL', label: 'Steals', color: '#f59e0b' },
  { key: 'BLK', label: 'Blocks', color: '#8b5cf6' },
  { key: 'TOV', label: 'Turnovers', color: '#ec4899' },
  { key: 'FG_PCT', label: 'FG%', color: '#06b6d4' },
  { key: 'FG3_PCT', label: '3P%', color: '#84cc16' },
  { key: 'FT_PCT', label: 'FT%', color: '#f97316' },
  { key: 'PLUS_MINUS', label: '+/-', color: '#6366f1' }
];
