import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { parseCSVFile, aggregateTeamStats } from '@/lib/nba-data';

const REGULAR_SEASON_PATH = path.join(process.cwd(), 'upload', 'regular_season_totals_2010_2024.csv');
const PLAYOFFS_PATH = path.join(process.cwd(), 'upload', 'play_off_totals_2010_2024.csv');

// Cache for aggregated data
interface CachedTeams {
  regularSeason: Map<string, any[]>;
  playoffs: Map<string, any[]>;
  allTime: any[];
}

let cachedTeams: CachedTeams | null = null;
let lastLoadTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute cache

async function loadData(): Promise<CachedTeams> {
  const [regularContent, playoffContent] = await Promise.all([
    readFile(REGULAR_SEASON_PATH, 'utf-8'),
    readFile(PLAYOFFS_PATH, 'utf-8')
  ]);

  const regularData = await parseCSVFile(regularContent);
  const playoffData = await parseCSVFile(playoffContent);

  // Group by season for regular season
  const regularBySeason = new Map<string, any[]>();
  regularData.forEach(game => {
    const season = game.SEASON_YEAR;
    if (!regularBySeason.has(season)) {
      regularBySeason.set(season, []);
    }
    regularBySeason.get(season)!.push(game);
  });

  // Group by season for playoffs
  const playoffBySeason = new Map<string, any[]>();
  playoffData.forEach(game => {
    const season = game.SEASON_YEAR;
    if (!playoffBySeason.has(season)) {
      playoffBySeason.set(season, []);
    }
    playoffBySeason.get(season)!.push(game);
  });

  // All-time stats (regular season)
  const allTimeStats = aggregateTeamStats(regularData);

  return {
    regularSeason: regularBySeason,
    playoffs: playoffBySeason,
    allTime: allTimeStats
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get('season');
    const type = searchParams.get('type') || 'regular'; // 'regular' or 'playoffs'
    const sortBy = searchParams.get('sortBy') || 'winPct';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Check cache
    const now = Date.now();
    if (!cachedTeams || now - lastLoadTime > CACHE_TTL) {
      cachedTeams = await loadData();
      lastLoadTime = now;
    }

    let teamStats: any[] = [];

    if (season) {
      // Get stats for a specific season
      const dataMap = type === 'playoffs' ? cachedTeams.playoffs : cachedTeams.regularSeason;
      const seasonData = dataMap.get(season) || [];
      teamStats = aggregateTeamStats(seasonData);
    } else {
      // Get all-time stats (regular season only for all-time)
      teamStats = cachedTeams.allTime;
    }

    // Sort the results
    teamStats.sort((a, b) => {
      const aVal = a[sortBy] ?? 0;
      const bVal = b[sortBy] ?? 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    // Get available seasons
    const availableSeasons = {
      regular: Array.from(cachedTeams.regularSeason.keys()).sort(),
      playoffs: Array.from(cachedTeams.playoffs.keys()).sort()
    };

    return NextResponse.json({
      teams: teamStats,
      season,
      type,
      availableSeasons,
      totalTeams: teamStats.length
    });
  } catch (error) {
    console.error('Error loading team data:', error);
    return NextResponse.json(
      { error: 'Failed to load team statistics' },
      { status: 500 }
    );
  }
}
