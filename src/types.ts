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
  startDate?: string;
  endDate?: string;
  status?: 'upcoming' | 'active' | 'completed';
  grandFinalPlayed: boolean;
  teams?: Team[];
  matches?: Match[];
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

export interface TeamStats {
  teamId: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
}