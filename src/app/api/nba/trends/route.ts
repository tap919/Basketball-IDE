import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { parseCSVFile } from '@/lib/nba-data';

const REGULAR_SEASON_PATH = path.join(process.cwd(), 'upload', 'regular_season_totals_2010_2024.csv');
const PLAYOFFS_PATH = path.join(process.cwd(), 'upload', 'play_off_totals_2010_2024.csv');

// Cache
let cachedTrends: any = null;
let lastLoadTime = 0;
const CACHE_TTL = 60 * 1000;

interface SeasonStats {
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

async function calculateSeasonTrends(): Promise<{
  regularSeason: SeasonStats[];
  playoffs: SeasonStats[];
}> {
  const [regularContent, playoffContent] = await Promise.all([
    readFile(REGULAR_SEASON_PATH, 'utf-8'),
    readFile(PLAYOFFS_PATH, 'utf-8')
  ]);

  const regularData = await parseCSVFile(regularContent);
  const playoffData = await parseCSVFile(playoffContent);

  const calculateStats = (games: any[]): SeasonStats[] => {
    const seasonMap = new Map<string, any[]>();
    
    games.forEach(game => {
      const season = game.SEASON_YEAR;
      if (!seasonMap.has(season)) {
        seasonMap.set(season, []);
      }
      seasonMap.get(season)!.push(game);
    });

    return Array.from(seasonMap.entries())
      .map(([season, seasonGames]) => {
        const count = seasonGames.length;
        return {
          season,
          totalGames: count,
          avgPoints: seasonGames.reduce((sum, g) => sum + (g.PTS || 0), 0) / count,
          avgRebounds: seasonGames.reduce((sum, g) => sum + (g.REB || 0), 0) / count,
          avgAssists: seasonGames.reduce((sum, g) => sum + (g.AST || 0), 0) / count,
          avgFG_PCT: seasonGames.reduce((sum, g) => sum + (g.FG_PCT || 0), 0) / count,
          avgFG3_PCT: seasonGames.reduce((sum, g) => sum + (g.FG3_PCT || 0), 0) / count,
          avgFT_PCT: seasonGames.reduce((sum, g) => sum + (g.FT_PCT || 0), 0) / count,
          avgTOV: seasonGames.reduce((sum, g) => sum + (g.TOV || 0), 0) / count,
          avgSTL: seasonGames.reduce((sum, g) => sum + (g.STL || 0), 0) / count,
          avgBLK: seasonGames.reduce((sum, g) => sum + (g.BLK || 0), 0) / count,
          avgPlusMinus: seasonGames.reduce((sum, g) => sum + (g.PLUS_MINUS || 0), 0) / count,
        };
      })
      .sort((a, b) => a.season.localeCompare(b.season));
  };

  return {
    regularSeason: calculateStats(regularData),
    playoffs: calculateStats(playoffData)
  };
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    if (!cachedTrends || now - lastLoadTime > CACHE_TTL) {
      cachedTrends = await calculateSeasonTrends();
      lastLoadTime = now;
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'regular';

    return NextResponse.json({
      trends: type === 'playoffs' ? cachedTrends.playoffs : cachedTrends.regularSeason,
      type,
      availableTypes: ['regular', 'playoffs']
    });
  } catch (error) {
    console.error('Error loading trends:', error);
    return NextResponse.json(
      { error: 'Failed to load trend data' },
      { status: 500 }
    );
  }
}
