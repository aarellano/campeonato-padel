export interface Player {
  id: string;
  name: string;
  photoUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  players: [Player, Player];
  photoUrl?: string;
}

export interface Tournament {
  id: string;
  name: string;
  teams: Team[];
  matches: MatchResult[];
  startDate?: string;
  endDate?: string;
  status?: 'upcoming' | 'active' | 'completed';
  completed?: boolean;
  grandFinalPlayed: boolean;
  createdAt: string;
}

export interface MatchResult {
  id: string;
  tournamentId?: string;
  teamAId: string;
  teamBId: string;
  teamAScore: number;
  teamBScore: number;
  isGrandFinal?: boolean;
  date: string;
}

// Alias for backward compatibility - both types are used in the app
export type Match = MatchResult;

export interface TeamStats {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  totalScore: number;
  rank: number;
}