import { v4 as uuidv4 } from 'uuid';
import { Player, Team, Tournament, Match, TeamStats } from '../types';

// Mock data storage
let players: Player[] = [];
let teams: Team[] = [];
let tournaments: Tournament[] = [];
let matches: Match[] = [];

// Player Services
export const createPlayer = (name: string, photoUrl?: string): Player => {
  const newPlayer: Player = {
    id: uuidv4(),
    name,
    photoUrl
  };
  players.push(newPlayer);
  return newPlayer;
};

export const getPlayers = (): Player[] => {
  return [...players];
};

// Team Services
export const createTeam = (name: string, playerA: Player, playerB: Player, photoUrl?: string): Team => {
  const newTeam: Team = {
    id: uuidv4(),
    name,
    players: [playerA, playerB],
    photoUrl
  };
  teams.push(newTeam);
  return newTeam;
};

export const getTeams = (): Team[] => {
  return [...teams];
};

export const getTeamById = (teamId: string): Team | undefined => {
  const teams = getTeams();
  return teams.find(team => team.id === teamId);
};

// Tournament Services
export const createTournament = (name: string): Tournament => {
  const newTournament: Tournament = {
    id: uuidv4(),
    name,
    teams: [],
    matches: [],
    completed: false,
    grandFinalPlayed: false,
    createdAt: new Date().toISOString()
  };
  tournaments.push(newTournament);
  return newTournament;
};

export const getTournaments = (): Tournament[] => {
  return [...tournaments];
};

export const getCurrentTournament = (): Tournament | undefined => {
  const tournaments = getTournaments();
  return tournaments.length > 0 ? tournaments[0] : undefined;
};

export const addTeamToTournament = (tournamentId: string, team: Team): void => {
  const tournament = tournaments.find(t => t.id === tournamentId);
  if (tournament) {
    tournament.teams.push(team);
  }
};

// Match Services
export const createMatch = (
  tournamentId: string,
  teamAId: string,
  teamBId: string,
  teamAScore: number,
  teamBScore: number,
  isGrandFinal = false
): Match => {
  const storedMatches = localStorage.getItem('matches');
  const matches = storedMatches ? JSON.parse(storedMatches) as Match[] : [];

  const newMatch: Match = {
    id: `match_${Date.now()}`,
    tournamentId,
    teamAId,
    teamBId,
    teamAScore,
    teamBScore,
    date: new Date().toISOString(),
    isGrandFinal
  };

  matches.push(newMatch);
  localStorage.setItem('matches', JSON.stringify(matches));

  // If this was the grand final, update the tournament status
  if (isGrandFinal) {
    const tournaments = getTournaments();
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
      tournament.grandFinalPlayed = true;
      localStorage.setItem('tournaments', JSON.stringify(tournaments));
    }
  }

  return newMatch;
};

export const getMatches = (tournamentId: string): Match[] => {
  const storedMatches = localStorage.getItem('matches');
  if (!storedMatches) return [];

  const matches = JSON.parse(storedMatches) as Match[];
  return matches.filter(match => match.tournamentId === tournamentId);
};

// Tournament Statistics
export const calculateTeamStats = (tournamentId: string): TeamStats[] => {
  const tournament = tournaments.find(t => t.id === tournamentId);
  if (!tournament) return [];

  const regularMatches = tournament.matches.filter(match => !match.isGrandFinal);

  const stats: Record<string, TeamStats> = {};

  // Initialize stats for all teams
  tournament.teams.forEach(team => {
    stats[team.id] = {
      teamId: team.id,
      teamName: team.name,
      matchesPlayed: 0,
      matchesWon: 0,
      totalScore: 0,
      rank: 0
    };
  });

  // Calculate stats from matches
  regularMatches.forEach(match => {
    // Team A stats
    if (stats[match.teamAId]) {
      stats[match.teamAId].matchesPlayed += 1;
      stats[match.teamAId].totalScore += match.teamAScore;
      if (match.teamAScore > match.teamBScore) {
        stats[match.teamAId].matchesWon += 1;
      }
    }

    // Team B stats
    if (stats[match.teamBId]) {
      stats[match.teamBId].matchesPlayed += 1;
      stats[match.teamBId].totalScore += match.teamBScore;
      if (match.teamBScore > match.teamAScore) {
        stats[match.teamBId].matchesWon += 1;
      }
    }
  });

  // Convert to array and sort by matches won, then total score
  const teamStatsArray = Object.values(stats).sort((a, b) => {
    if (a.matchesWon !== b.matchesWon) {
      return b.matchesWon - a.matchesWon;
    }
    return b.totalScore - a.totalScore;
  });

  // Assign ranks
  teamStatsArray.forEach((stat, index) => {
    stat.rank = index + 1;
  });

  return teamStatsArray;
};

// Returns pairs of teams that haven't played against each other yet
export const getMissingMatches = (tournamentId: string): { teamA: Team, teamB: Team }[] => {
  const tournament = tournaments.find(t => t.id === tournamentId);
  if (!tournament) return [];

  const regularMatches = tournament.matches.filter(match => !match.isGrandFinal);
  const teams = tournament.teams;
  const missingMatches: { teamA: Team, teamB: Team }[] = [];

  // For each pair of teams, check if they've played against each other
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const teamA = teams[i];
      const teamB = teams[j];

      const matchExists = regularMatches.some(
        match =>
          (match.teamAId === teamA.id && match.teamBId === teamB.id) ||
          (match.teamAId === teamB.id && match.teamBId === teamA.id)
      );

      if (!matchExists) {
        missingMatches.push({ teamA, teamB });
      }
    }
  }

  return missingMatches;
};

// Get the top two teams for the grand final
export const getTopTwoTeams = (tournamentId: string): [Team | undefined, Team | undefined] => {
  const teams = getTeams();
  const matches = getMatches(tournamentId);

  // Calculate team points
  const teamPoints: { [teamId: string]: number } = {};

  // Initialize all teams with 0 points
  teams.forEach(team => {
    teamPoints[team.id] = 0;
  });

  // Calculate points from matches (3 points for a win)
  matches.forEach(match => {
    // Skip the grand final for calculating rankings
    if (match.isGrandFinal) return;

    if (match.teamAScore > match.teamBScore) {
      teamPoints[match.teamAId] = (teamPoints[match.teamAId] || 0) + 3;
    } else if (match.teamBScore > match.teamAScore) {
      teamPoints[match.teamBId] = (teamPoints[match.teamBId] || 0) + 3;
    } else {
      // In case of a tie (although it's unlikely in padel)
      teamPoints[match.teamAId] = (teamPoints[match.teamAId] || 0) + 1;
      teamPoints[match.teamBId] = (teamPoints[match.teamBId] || 0) + 1;
    }
  });

  // Sort teams by points
  const sortedTeams = [...teams].sort((a, b) => {
    return (teamPoints[b.id] || 0) - (teamPoints[a.id] || 0);
  });

  return [sortedTeams[0], sortedTeams[1]];
};

/**
 * Load initial mock data for development
 */
export const loadMockData = () => {
  // Create some mock teams with players if none exist
  if (!localStorage.getItem('teams')) {
    const player1: Player = {
      id: 'player_1',
      name: 'Juan Pérez',
      photoUrl: undefined
    };

    const player2: Player = {
      id: 'player_2',
      name: 'Ana Gómez',
      photoUrl: undefined
    };

    const player3: Player = {
      id: 'player_3',
      name: 'Carlos Ruiz',
      photoUrl: undefined
    };

    const player4: Player = {
      id: 'player_4',
      name: 'María López',
      photoUrl: undefined
    };

    const player5: Player = {
      id: 'player_5',
      name: 'Fernando Torres',
      photoUrl: undefined
    };

    const player6: Player = {
      id: 'player_6',
      name: 'Lucia García',
      photoUrl: undefined
    };

    const players = [player1, player2, player3, player4, player5, player6];
    localStorage.setItem('players', JSON.stringify(players));

    const team1: Team = {
      id: 'team_1',
      name: 'Raquetas Furiosas',
      players: [player1, player2]
    };

    const team2: Team = {
      id: 'team_2',
      name: 'Padel Pros',
      players: [player3, player4]
    };

    const team3: Team = {
      id: 'team_3',
      name: 'Novatos con Suerte',
      players: [player5, player6]
    };

    const teams = [team1, team2, team3];
    localStorage.setItem('teams', JSON.stringify(teams));
  }

  // Create a mock tournament if none exists
  if (!localStorage.getItem('tournaments')) {
    const tournaments: Tournament[] = [
      {
        id: 'tournament_1',
        name: 'Campeonato de Padel 2023',
        startDate: '2023-06-01',
        endDate: '2023-06-30',
        status: 'active',
        grandFinalPlayed: false
      }
    ];
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
  }

  // Create some mock matches if none exist
  if (!localStorage.getItem('matches')) {
    const teams = getTeams();

    if (teams.length >= 3) {
      const team1 = teams[0];
      const team2 = teams[1];
      const team3 = teams[2];

      const tournament = getCurrentTournament();

      if (tournament) {
        const matches: Match[] = [
          {
            id: 'match_1',
            tournamentId: tournament.id,
            teamAId: team1.id,
            teamBId: team2.id,
            teamAScore: 7,
            teamBScore: 5,
            date: '2023-06-10T14:00:00.000Z',
            isGrandFinal: false
          },
          {
            id: 'match_2',
            tournamentId: tournament.id,
            teamAId: team1.id,
            teamBId: team3.id,
            teamAScore: 6,
            teamBScore: 4,
            date: '2023-06-15T16:30:00.000Z',
            isGrandFinal: false
          },
          {
            id: 'match_3',
            tournamentId: tournament.id,
            teamAId: team2.id,
            teamBId: team3.id,
            teamAScore: 7,
            teamBScore: 6,
            date: '2023-06-20T18:00:00.000Z',
            isGrandFinal: false
          }
        ];

        localStorage.setItem('matches', JSON.stringify(matches));
      }
    }
  }

  return {
    teams: getTeams(),
    tournaments: getTournaments()
  };
};