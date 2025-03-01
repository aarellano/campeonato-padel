export interface Player {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
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
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  grandFinalPlayed: boolean;
}

export interface MatchResult {
  id: string;
  tournamentId: string;
  teamAId: string;
  teamBId: string;
  teamAScore: number;
  teamBScore: number;
  date: string;
  isGrandFinal?: boolean;
}

export interface Match {
  id: string;
  tournamentId: string;
  teamAId: string;
  teamBId: string;
  teamAScore: number;
  teamBScore: number;
  date: string;
  isGrandFinal?: boolean;
}