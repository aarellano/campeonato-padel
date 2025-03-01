import { v4 as uuidv4 } from 'uuid';

// Flag to determine if we should use mock data or real Amplify API
let useMockData = true;

// Mock data storage
let players = [];
let teams = [];
let tournaments = [];
let matches = [];

// Helper to get data from localStorage
const getLocalStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper to save data to localStorage
const saveLocalStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Player Services
export const createPlayer = (name, photoUrl) => {
  const newPlayer = {
    id: uuidv4(),
    name,
    photoUrl
  };

  if (useMockData) {
    players.push(newPlayer);
    saveLocalStorageData('players', players);
  }

  return newPlayer;
};

export const getPlayers = () => {
  if (useMockData) {
    return [...players];
  }
  return [];
};

export const getPlayer = (id) => {
  if (useMockData) {
    return players.find(player => player.id === id);
  }
  return null;
};

export const updatePlayer = (id, updates) => {
  if (useMockData) {
    const index = players.findIndex(player => player.id === id);
    if (index !== -1) {
      players[index] = { ...players[index], ...updates };
      saveLocalStorageData('players', players);
      return players[index];
    }
  }
  return null;
};

export const deletePlayer = (id) => {
  if (useMockData) {
    players = players.filter(player => player.id !== id);
    saveLocalStorageData('players', players);
    return true;
  }
  return false;
};

// Team Services
export const createTeam = (name, playerIds, photoUrl) => {
  if (!Array.isArray(playerIds) || playerIds.length !== 2) {
    throw new Error("A team must have exactly 2 players");
  }

  const teamPlayers = playerIds.map(id => {
    const player = getPlayer(id);
    if (!player) throw new Error(`Player with id ${id} not found`);
    return player;
  });

  const newTeam = {
    id: uuidv4(),
    name,
    players: teamPlayers,
    photoUrl
  };

  if (useMockData) {
    teams.push(newTeam);
    saveLocalStorageData('teams', teams);
  }

  return newTeam;
};

export const getTeams = () => {
  if (useMockData) {
    return [...teams];
  }
  return [];
};

export const getTeam = (id) => {
  if (useMockData) {
    return teams.find(team => team.id === id);
  }
  return null;
};

export const updateTeam = (id, updates) => {
  if (useMockData) {
    const index = teams.findIndex(team => team.id === id);
    if (index !== -1) {
      teams[index] = { ...teams[index], ...updates };
      saveLocalStorageData('teams', teams);
      return teams[index];
    }
  }
  return null;
};

export const deleteTeam = (id) => {
  if (useMockData) {
    teams = teams.filter(team => team.id !== id);
    saveLocalStorageData('teams', teams);
    return true;
  }
  return false;
};

// Tournament Services
export const createTournament = (name, startDate) => {
  const now = new Date();
  const start = startDate ? new Date(startDate) : now;

  const newTournament = {
    id: uuidv4(),
    name,
    teams: [],
    matches: [],
    startDate: start.toISOString(),
    endDate: '',
    status: 'upcoming',
    completed: false,
    grandFinalPlayed: false,
    createdAt: now.toISOString()
  };

  if (useMockData) {
    tournaments.push(newTournament);
    saveLocalStorageData('tournaments', tournaments);
  }

  return newTournament;
};

export const getTournaments = () => {
  if (useMockData) {
    return [...tournaments];
  }
  return [];
};

export const getTournament = (id) => {
  if (useMockData) {
    return tournaments.find(t => t.id === id);
  }
  return null;
};

export const getCurrentTournament = () => {
  if (useMockData) {
    // Get the most recent active tournament, or the most recent one if none are active
    const active = tournaments.filter(t => t.status === 'active');
    if (active.length > 0) {
      return active.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
    }

    if (tournaments.length > 0) {
      return tournaments.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
    }
  }
  return null;
};

export const updateTournament = (id, updates) => {
  if (useMockData) {
    const index = tournaments.findIndex(t => t.id === id);
    if (index !== -1) {
      tournaments[index] = { ...tournaments[index], ...updates };
      saveLocalStorageData('tournaments', tournaments);
      return tournaments[index];
    }
  }
  return null;
};

export const deleteTournament = (id) => {
  if (useMockData) {
    tournaments = tournaments.filter(t => t.id !== id);
    saveLocalStorageData('tournaments', tournaments);
    return true;
  }
  return false;
};

export const addTeamToTournament = (tournamentId, teamId) => {
  if (useMockData) {
    const tournament = getTournament(tournamentId);
    const team = getTeam(teamId);

    if (!tournament || !team) {
      return false;
    }

    // Check if team is already in the tournament
    if (tournament.teams.some(t => t.id === teamId)) {
      return false;
    }

    tournament.teams.push(team);
    updateTournament(tournamentId, { teams: tournament.teams });

    return true;
  }

  return false;
};

export const removeTeamFromTournament = (tournamentId, teamId) => {
  if (useMockData) {
    const tournament = getTournament(tournamentId);

    if (!tournament) {
      return false;
    }

    tournament.teams = tournament.teams.filter(t => t.id !== teamId);
    updateTournament(tournamentId, { teams: tournament.teams });

    return true;
  }

  return false;
};

// Match Services
export const createMatch = (tournamentId, teamAId, teamBId, date, isGrandFinal = false) => {
  const newMatch = {
    id: uuidv4(),
    tournamentId,
    teamAId,
    teamBId,
    teamAScore: 0,
    teamBScore: 0,
    isGrandFinal,
    date: date || new Date().toISOString()
  };

  if (useMockData) {
    matches.push(newMatch);
    saveLocalStorageData('matches', matches);

    // Also add to tournament
    const tournament = getTournament(tournamentId);
    if (tournament) {
      tournament.matches.push(newMatch);
      updateTournament(tournamentId, { matches: tournament.matches });

      // If this is a grand final and is being created, update tournament status
      if (isGrandFinal) {
        updateTournament(tournamentId, { status: 'active' });
      }
    }
  }

  return newMatch;
};

export const getMatches = (tournamentId) => {
  if (useMockData) {
    if (tournamentId) {
      return matches.filter(match => match.tournamentId === tournamentId);
    }
    return [...matches];
  }
  return [];
};

export const getMatch = (id) => {
  if (useMockData) {
    return matches.find(match => match.id === id);
  }
  return null;
};

export const updateMatch = (id, updates) => {
  if (useMockData) {
    const index = matches.findIndex(match => match.id === id);
    if (index !== -1) {
      matches[index] = { ...matches[index], ...updates };
      saveLocalStorageData('matches', matches);

      // Also update in tournament
      if (matches[index].tournamentId) {
        const tournament = getTournament(matches[index].tournamentId);
        if (tournament) {
          const tournamentMatchIndex = tournament.matches.findIndex(m => m.id === id);
          if (tournamentMatchIndex !== -1) {
            tournament.matches[tournamentMatchIndex] = { ...tournament.matches[tournamentMatchIndex], ...updates };
            updateTournament(tournament.id, { matches: tournament.matches });

            // If this is a grand final and scores are updated, update tournament status
            if (matches[index].isGrandFinal &&
                (updates.teamAScore !== undefined || updates.teamBScore !== undefined)) {
              updateTournament(tournament.id, {
                status: 'completed',
                completed: true,
                grandFinalPlayed: true,
                endDate: new Date().toISOString()
              });
            }
          }
        }
      }

      return matches[index];
    }
  }
  return null;
};

export const deleteMatch = (id) => {
  if (useMockData) {
    const match = getMatch(id);
    if (!match) return false;

    matches = matches.filter(m => m.id !== id);
    saveLocalStorageData('matches', matches);

    // Also remove from tournament
    if (match.tournamentId) {
      const tournament = getTournament(match.tournamentId);
      if (tournament) {
        tournament.matches = tournament.matches.filter(m => m.id !== id);
        updateTournament(tournament.id, { matches: tournament.matches });
      }
    }

    return true;
  }
  return false;
};

// Generate all possible match combinations for a tournament
export const generateTournamentMatches = (tournamentId) => {
  if (useMockData) {
    const tournament = getTournament(tournamentId);
    if (!tournament || tournament.teams.length < 2) {
      return false;
    }

    // Remove existing matches if any
    if (tournament.matches.length > 0) {
      tournament.matches = [];
    }

    const teams = tournament.teams;
    const newMatches = [];

    // Generate a match for each pair of teams
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const newMatch = createMatch(
          tournamentId,
          teams[i].id,
          teams[j].id,
          new Date().toISOString()
        );
        newMatches.push(newMatch);
      }
    }

    // Update tournament status to active if matches were created
    if (newMatches.length > 0) {
      updateTournament(tournamentId, {
        status: 'active',
        matches: newMatches
      });
    }

    return newMatches;
  }

  return [];
};

// Calculate team statistics for a tournament
export const calculateTournamentStats = (tournamentId) => {
  if (useMockData) {
    const tournament = getTournament(tournamentId);
    if (!tournament) return [];

    const teamStats = {};

    // Initialize stats for all teams
    tournament.teams.forEach(team => {
      teamStats[team.id] = {
        teamId: team.id,
        teamName: team.name,
        matchesPlayed: 0,
        matchesWon: 0,
        totalScore: 0,
        rank: 0
      };
    });

    // Calculate stats from matches
    tournament.matches.forEach(match => {
      if (match.teamAScore === 0 && match.teamBScore === 0) {
        // Skip matches that haven't been played
        return;
      }

      if (teamStats[match.teamAId]) {
        teamStats[match.teamAId].matchesPlayed++;
        teamStats[match.teamAId].totalScore += match.teamAScore;
        if (match.teamAScore > match.teamBScore) {
          teamStats[match.teamAId].matchesWon++;
        }
      }

      if (teamStats[match.teamBId]) {
        teamStats[match.teamBId].matchesPlayed++;
        teamStats[match.teamBId].totalScore += match.teamBScore;
        if (match.teamBScore > match.teamAScore) {
          teamStats[match.teamBId].matchesWon++;
        }
      }
    });

    // Convert to array and sort by wins and then by total score
    const statsArray = Object.values(teamStats);
    statsArray.sort((a, b) => {
      if (b.matchesWon !== a.matchesWon) {
        return b.matchesWon - a.matchesWon;
      }
      return b.totalScore - a.totalScore;
    });

    // Assign ranks
    statsArray.forEach((stat, index) => {
      stat.rank = index + 1;
    });

    return statsArray;
  }

  return [];
};

// Determine finalists for a tournament
export const determineFinalists = (tournamentId) => {
  if (useMockData) {
    const stats = calculateTournamentStats(tournamentId);
    if (stats.length < 2) return null;

    // Top 2 teams become finalists
    return {
      teamA: stats[0],
      teamB: stats[1]
    };
  }

  return null;
};

// Setup data source - mock or real API
export const toggleDataSource = (useMock) => {
  useMockData = useMock;

  if (useMockData) {
    // Load data from localStorage
    players = getLocalStorageData('players');
    teams = getLocalStorageData('teams');
    tournaments = getLocalStorageData('tournaments');
    matches = getLocalStorageData('matches');
  }
};

// Initialize with mock data for development
export const loadMockData = () => {
  // Check if we already have data
  const existingPlayers = getLocalStorageData('players');
  const existingTeams = getLocalStorageData('teams');
  const existingTournaments = getLocalStorageData('tournaments');

  if (existingPlayers.length > 0 || existingTeams.length > 0 || existingTournaments.length > 0) {
    // We already have data, load it
    players = existingPlayers;
    teams = existingTeams;
    tournaments = existingTournaments;
    matches = getLocalStorageData('matches');
    return;
  }

  // Create sample players
  const player1 = createPlayer('Juan Pérez', 'https://randomuser.me/api/portraits/men/1.jpg');
  const player2 = createPlayer('María García', 'https://randomuser.me/api/portraits/women/1.jpg');
  const player3 = createPlayer('Carlos Rodríguez', 'https://randomuser.me/api/portraits/men/2.jpg');
  const player4 = createPlayer('Ana Martínez', 'https://randomuser.me/api/portraits/women/2.jpg');
  const player5 = createPlayer('David López', 'https://randomuser.me/api/portraits/men/3.jpg');
  const player6 = createPlayer('Laura Sánchez', 'https://randomuser.me/api/portraits/women/3.jpg');

  // Create sample teams
  const team1 = createTeam('Los Campeones', [player1.id, player2.id], 'https://picsum.photos/id/237/300/200');
  const team2 = createTeam('Padel Stars', [player3.id, player4.id], 'https://picsum.photos/id/238/300/200');
  const team3 = createTeam('Raqueta Veloz', [player5.id, player6.id], 'https://picsum.photos/id/239/300/200');

  // Create sample tournament
  const tournament = createTournament('Torneo Primavera 2023');

  // Add teams to tournament
  addTeamToTournament(tournament.id, team1.id);
  addTeamToTournament(tournament.id, team2.id);
  addTeamToTournament(tournament.id, team3.id);

  // Generate matches
  generateTournamentMatches(tournament.id);

  // Save all data to localStorage
  saveLocalStorageData('players', players);
  saveLocalStorageData('teams', teams);
  saveLocalStorageData('tournaments', tournaments);
  saveLocalStorageData('matches', matches);
};

// Add alias for getTeam as getTeamById for backward compatibility
export const getTeamById = (id) => {
  return getTeam(id);
};

// Get top two teams by ranking
export const getTopTwoTeams = (tournamentId) => {
  const stats = calculateTournamentStats(tournamentId);
  const sortedStats = [...stats].sort((a, b) => b.totalScore - a.totalScore || b.matchesWon - a.matchesWon);

  const firstTeam = sortedStats.length > 0 ? getTeam(sortedStats[0].teamId) : undefined;
  const secondTeam = sortedStats.length > 1 ? getTeam(sortedStats[1].teamId) : undefined;

  return [firstTeam, secondTeam];
};