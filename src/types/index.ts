export type Player = {
  id: string;
  name: string;
  photoUrl?: string;
};

export type Team = {
  id: string;
  name: string;
  players: [Player, Player];
  photoUrl?: string;
};

export type MatchResult = {
  id: string;
  teamAId: string;
  teamBId: string;
  teamAScore: number;
  teamBScore: number;
  isGrandFinal?: boolean;
  date: string;
};

export type Tournament = {
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
};

export type TeamStats = {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  totalScore: number;
  rank: number;
};