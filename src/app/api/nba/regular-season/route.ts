import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { parseCSVFile } from '@/lib/nba-data';

const CSV_PATH = path.join(process.cwd(), 'upload', 'regular_season_totals_2010_2024.csv');

// Cache for parsed data
let cachedData: any[] | null = null;
let lastLoadTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute cache

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get('season');
    const team = searchParams.get('team');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // Check cache
    const now = Date.now();
    if (!cachedData || now - lastLoadTime > CACHE_TTL) {
      const csvContent = await readFile(CSV_PATH, 'utf-8');
      cachedData = await parseCSVFile(csvContent);
      lastLoadTime = now;
    }

    let filteredData = cachedData;

    // Filter by season if provided
    if (season) {
      filteredData = filteredData.filter(game => game.SEASON_YEAR === season);
    }

    // Filter by team if provided
    if (team) {
      filteredData = filteredData.filter(game => 
        game.TEAM_ABBREVIATION === team || 
        game.TEAM_NAME.toLowerCase().includes(team.toLowerCase())
      );
    }

    // Calculate pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        season,
        team
      }
    });
  } catch (error) {
    console.error('Error loading regular season data:', error);
    return NextResponse.json(
      { error: 'Failed to load regular season data' },
      { status: 500 }
    );
  }
}
