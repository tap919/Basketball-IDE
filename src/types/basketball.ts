export interface NBAGameStats {
  SEASON_YEAR: string;
  TEAM_ID: number;
  TEAM_ABBREVIATION: string;
  TEAM_NAME: string;
  GAME_ID: string;
  GAME_DATE: string;
  MATCHUP: string;
  WL: string;
  MIN: number;
  FGM: number;
  FGA: number;
  FG_PCT: number;
  FG3M: number;
  FG3A: number;
  FG3_PCT: number;
  FTM: number;
  FTA: number;
  FT_PCT: number;
  OREB: number;
  DREB: number;
  REB: number;
  AST: number;
  TOV: number;
  STL: number;
  BLK: number;
  BLKA: number;
  PF: number;
  PFD: number;
  PTS: number;
  PLUS_MINUS: number;
}

export interface TeamStats {
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

export interface SeasonComparison {
  season: string;
  regularSeason: {
    totalGames: number;
    avgPoints: number;
    avgRebounds: number;
  };
  playoffs: {
    totalGames: number;
    avgPoints: number;
    avgRebounds: number;
  };
}

export interface BiotechAnalogy {
  basketballTerm: string;
  biotechEquivalent: string;
  description: string;
  formula?: string;
}
