import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleLayout from '../components/SimpleLayout';
import { getTournaments, getTeams } from '../services/dataService';
import { Tournament, Team, MatchResult } from '../types';
import { FaTrophy, FaUsers, FaCalendarAlt, FaTimes, FaPlus } from 'react-icons/fa';

const TournamentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  useEffect(() => {
    const fetchTournament = () => {
      if (!id) return;

      try {
        // Find tournament by id from the list of all tournaments
        const allTournaments = getTournaments();
        const fetchedTournament = allTournaments.find(t => t.id === id);

        if (fetchedTournament) {
          setTournament(fetchedTournament);

          // Get teams not in this tournament
          const allTeams = getTeams();
          const tournamentTeamIds = fetchedTournament.teams.map((team: Team) => team.id);
          const teamsNotInTournament = allTeams.filter(team => !tournamentTeamIds.includes(team.id));
          setAvailableTeams(teamsNotInTournament);
        }
      } catch (error) {
        console.error('Error fetching tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const handleAddTeam = () => {
    if (!id || !selectedTeamId || !tournament) return;

    try {
      // Find the selected team
      const teamToAdd = getTeams().find(team => team.id === selectedTeamId);
      if (!teamToAdd) return;

      // Add the team to the tournament (manual implementation since we don't have addTeamToTournament)
      const updatedTournament = {
        ...tournament,
        teams: [...tournament.teams, teamToAdd]
      };

      setTournament(updatedTournament);

      // Update available teams
      setAvailableTeams(availableTeams.filter(team => team.id !== selectedTeamId));
      setShowAddTeamModal(false);
      setSelectedTeamId('');

      // In a real app, we would save this to the backend/localStorage here
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Error al añadir equipo al torneo');
    }
  };

  const handleGenerateMatches = () => {
    if (!tournament || !id) return;

    if (tournament.matches.length > 0) {
      if (!confirm('Ya existen partidos para este torneo. ¿Deseas generar nuevos partidos? Esto eliminará los resultados existentes.')) {
        return;
      }
    }

    try {
      // Simple implementation - each team plays against all other teams
      const teams = tournament.teams;
      const newMatches: MatchResult[] = [];

      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          // Create a match between teams[i] and teams[j]
          const match: MatchResult = {
            id: crypto.randomUUID(),
            tournamentId: id,
            teamAId: teams[i].id,
            teamBId: teams[j].id,
            teamAScore: 0,
            teamBScore: 0,
            date: new Date().toISOString()
          };
          newMatches.push(match);
        }
      }

      // Update tournament with new matches
      const updatedTournament: Tournament = {
        ...tournament,
        matches: newMatches,
        status: 'active' as 'active' // Type assertion to match the enum
      };
      setTournament(updatedTournament);

      alert('Se han generado los partidos correctamente');
    } catch (error) {
      console.error('Error generating matches:', error);
      alert('Error al generar los partidos');
    }
  };

  if (loading) {
    return (
      <SimpleLayout title="Detalles del Torneo">
        <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>
      </SimpleLayout>
    );
  }

  if (!tournament) {
    return (
      <SimpleLayout title="Torneo no encontrado">
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'var(--card-bg)',
          borderRadius: '1rem',
          boxShadow: 'var(--card-shadow)',
          border: '2px solid var(--border-color)'
        }}>
          <p>El torneo que buscas no existe o ha sido eliminado</p>
          <button
            onClick={() => navigate('/tournaments')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: 'var(--brand-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Volver a Torneos
          </button>
        </div>
      </SimpleLayout>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Próximo';
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'var(--upcoming-color)';
      case 'active': return 'var(--active-color)';
      case 'completed': return 'var(--completed-color)';
      default: return 'var(--text-color-light)';
    }
  };

  return (
    <SimpleLayout title={tournament.name}>
      {/* Tournament Header Card */}
      <div style={{
        position: 'relative',
        marginBottom: '1.5rem',
        background: 'var(--card-bg)',
        borderRadius: '1rem',
        boxShadow: 'var(--card-shadow)',
        border: '2px solid var(--border-color)',
        padding: '1.5rem',
        overflow: 'hidden'
      }}>
        {/* Y2K Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: 'var(--highlight-color)',
          opacity: '0.2',
          borderRadius: '50%'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: 'var(--text-color)' }}>{tournament.name}</h2>
            <span style={{
              fontWeight: 'bold',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              background: getStatusColor(tournament.status),
              color: 'white',
              fontSize: '0.8rem'
            }}>
              {getStatusText(tournament.status)}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-color-muted)' }}>
              <FaUsers style={{ marginRight: '0.5rem' }} />
              <span>Equipos: {tournament.teams.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-color-muted)' }}>
              <FaTrophy style={{ marginRight: '0.5rem' }} />
              <span>Partidos: {tournament.matches.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-color-muted)' }}>
              <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
              <span>Creado: {new Date(tournament.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {tournament.startDate && (
            <div style={{
              fontSize: '0.9rem',
              marginTop: '0.5rem',
              color: 'var(--text-color-muted)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
              <span>Fecha inicio: {new Date(tournament.startDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Teams Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Equipos</h3>
          <button
            onClick={() => setShowAddTeamModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--brand-color)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s'
            }}
          >
            <FaPlus style={{ marginRight: '0.5rem' }} /> Añadir Equipo
          </button>
        </div>

        {tournament.teams.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--card-bg)',
            borderRadius: '1rem',
            boxShadow: 'var(--card-shadow)',
            border: '2px solid var(--border-color)'
          }}>
            <p>No hay equipos en este torneo</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tournament.teams.map(team => (
              <div
                key={team.id}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '0.5rem',
                  boxShadow: 'var(--card-shadow)',
                  border: '1px solid var(--border-color)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{team.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-color-muted)' }}>
                    {team.players[0].name} y {team.players[1].name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Matches Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Partidos</h3>
          {tournament.teams.length >= 2 && (
            <button
              onClick={handleGenerateMatches}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--brand-color)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s'
              }}
            >
              <FaPlus style={{ marginRight: '0.5rem' }} /> Generar Partidos
            </button>
          )}
        </div>

        {tournament.matches.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--card-bg)',
            borderRadius: '1rem',
            boxShadow: 'var(--card-shadow)',
            border: '2px solid var(--border-color)'
          }}>
            <p>No hay partidos programados</p>
            {tournament.teams.length < 2 && (
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-color-muted)' }}>
                Añade al menos 2 equipos para generar partidos
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tournament.matches.map(match => {
              const team1 = tournament.teams.find(t => t.id === match.teamAId);
              const team2 = tournament.teams.find(t => t.id === match.teamBId);

              if (!team1 || !team2) return null;

              return (
                <div
                  key={match.id}
                  style={{
                    background: 'var(--card-bg)',
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--card-shadow)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/matches/${match.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, textAlign: 'right', padding: '0 0.5rem' }}>{team1.name}</div>
                    <div style={{
                      fontWeight: 'bold',
                      padding: '0.25rem 0.5rem',
                      margin: '0 0.5rem',
                      background: match.teamAScore > 0 || match.teamBScore > 0 ? 'var(--completed-color)' : 'var(--upcoming-color)',
                      color: 'white',
                      borderRadius: '0.25rem',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {match.teamAScore > 0 || match.teamBScore > 0 ? (
                        <>
                          <span>{match.teamAScore}</span>
                          <span>-</span>
                          <span>{match.teamBScore}</span>
                        </>
                      ) : (
                        'VS'
                      )}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left', padding: '0 0.5rem' }}>{team2.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '400px',
            boxShadow: 'var(--card-shadow)',
            overflow: 'hidden',
            border: '3px solid var(--brand-color-light)'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--brand-color)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Añadir Equipo al Torneo</h3>
              <button
                onClick={() => setShowAddTeamModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.25rem'
                }}
              >
                <FaTimes size={16} />
              </button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {availableTeams.length === 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <p>No hay equipos disponibles para añadir</p>
                  <button
                    onClick={() => {
                      setShowAddTeamModal(false);
                      navigate('/teams/add');
                    }}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: 'var(--brand-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Crear Nuevo Equipo
                  </button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="teamSelect"
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Selecciona un Equipo
                  </label>
                  <select
                    id="teamSelect"
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '2px solid var(--border-color)',
                      background: 'white',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <option value="">Selecciona un equipo...</option>
                    {availableTeams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.players[0].name} y {team.players[1].name})
                      </option>
                    ))}
                  </select>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      onClick={() => setShowAddTeamModal(false)}
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '0.5rem',
                        border: '2px solid var(--border-color)',
                        background: 'var(--background-color)',
                        color: 'var(--text-color)',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddTeam}
                      disabled={!selectedTeamId}
                      style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'var(--brand-color)',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: !selectedTeamId ? 'not-allowed' : 'pointer',
                        opacity: !selectedTeamId ? 0.7 : 1,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      Añadir Equipo
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </SimpleLayout>
  );
};

export default TournamentDetailsPage;