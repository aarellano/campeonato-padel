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
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  completed: boolean;
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

// Export Match as a direct type, not just an alias
export interface Match extends MatchResult {
  // Additional fields specific to Match can be added here if needed
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  totalScore: number;
  rank: number;
}