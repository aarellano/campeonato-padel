import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { getCurrentTournament, calculateTournamentStats, getTeamById } from '../services/dataService';

const RankingsPage = () => {
  const [tournament, setTournament] = useState(undefined);
  const [teamStats, setTeamStats] = useState([]);

  useEffect(() => {
    // Get current tournament
    const currentTournament = getCurrentTournament();
    setTournament(currentTournament);

    if (currentTournament) {
      // Calculate team stats
      const stats = calculateTournamentStats(currentTournament.id);
      setTeamStats(stats);
    }
  }, []);

  // Function to get a team object from its ID
  const getTeam = (teamId) => {
    return getTeamById(teamId);
  };

  // Function to get a medal icon based on rank
  const getRankBadge = (rank) => {
    if (rank === 1) {
      return <FaMedal style={{ color: 'gold', fontSize: '1.5rem' }} />;
    } else if (rank === 2) {
      return <FaMedal style={{ color: 'silver', fontSize: '1.5rem' }} />;
    } else if (rank === 3) {
      return <FaMedal style={{ color: '#CD7F32', fontSize: '1.5rem' }} />;
    }
    return null;
  };

  // Function to determine if a team is a finalist (top 2)
  const isFinalist = (rank) => {
    return rank <= 2;
  };

  return (
    <MainLayout title="Ranking">
      <div style={{ marginTop: '1rem' }}>
        {tournament ? (
          <>
            <div style={{
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <h2 style={{ marginBottom: '0.5rem' }}>
                {tournament.name}
              </h2>
              <p>
                {tournament.teams.length} equipos participantes
              </p>
              {tournament.grandFinalPlayed ? (
                <p style={{
                  color: 'var(--highlight-color)',
                  fontWeight: 'bold',
                  marginTop: '0.5rem'
                }}>
                  ¡Torneo finalizado!
                </p>
              ) : (
                <p style={{
                  color: 'var(--brand-color)',
                  marginTop: '0.5rem'
                }}>
                  Torneo en curso
                </p>
              )}
            </div>

            {teamStats.length > 0 ? (
              <>
                {/* Top 2 Teams (Finalists) */}
                {teamStats.filter(stat => isFinalist(stat.rank)).length > 0 && (
                  <div className="mb-3">
                    <h3 className="mb-2" style={{ textAlign: 'center' }}>
                      <FaTrophy style={{ color: 'gold', marginRight: '0.5rem' }} />
                      Finalistas
                    </h3>

                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      {teamStats
                        .filter(stat => isFinalist(stat.rank))
                        .map(stat => {
                          const team = getTeam(stat.teamId);
                          if (!team) return null;

                          return (
                            <div
                              key={stat.teamId}
                              className="card"
                              style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '1rem',
                                border: '2px solid',
                                borderColor: stat.rank === 1 ? 'gold' : 'silver',
                                background: 'linear-gradient(to bottom, white, var(--brand-color-light))'
                              }}
                            >
                              <div style={{
                                marginBottom: '0.5rem',
                                display: 'flex',
                                justifyContent: 'center'
                              }}>
                                {getRankBadge(stat.rank)}
                              </div>

                              <div
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  margin: '0 auto',
                                  border: '2px solid',
                                  borderColor: stat.rank === 1 ? 'gold' : 'silver'
                                }}
                              >
                                {team.photoUrl ? (
                                  <img
                                    src={team.photoUrl}
                                    alt={team.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'var(--brand-color-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--brand-color-dark)'
                                  }}>
                                    {team.name.substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>

                              <h3 style={{
                                fontWeight: 'bold',
                                marginTop: '0.5rem'
                              }}>
                                {team.name}
                              </h3>

                              <div style={{
                                marginTop: '0.5rem',
                                fontSize: '0.9rem'
                              }}>
                                <div>
                                  <strong>Ganados:</strong> {stat.matchesWon}/{stat.matchesPlayed}
                                </div>
                                <div>
                                  <strong>Puntos:</strong> {stat.totalScore}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {!tournament.grandFinalPlayed && (
                      <div style={{ textAlign: 'center' }}>
                        <Link to="/grand-final" className="button button-primary">
                          Jugar Gran Final
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Rankings Table */}
                <div className="card mb-3">
                  <h3 className="mb-2">Tabla de Posiciones</h3>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}>
                      <thead>
                        <tr style={{
                          borderBottom: '2px solid var(--brand-color-light)',
                          textAlign: 'left'
                        }}>
                          <th style={{ padding: '0.5rem' }}>#</th>
                          <th style={{ padding: '0.5rem' }}>Equipo</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center' }}>Jugados</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center' }}>Ganados</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center' }}>Puntos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamStats.map(stat => {
                          const team = getTeam(stat.teamId);
                          if (!team) return null;

                          return (
                            <tr
                              key={stat.teamId}
                              style={{
                                borderBottom: '1px solid var(--brand-color-light)',
                                backgroundColor: isFinalist(stat.rank)
                                  ? 'var(--brand-color-light)'
                                  : 'transparent'
                              }}
                            >
                              <td style={{
                                padding: '0.75rem 0.5rem',
                                fontWeight: 'bold'
                              }}>
                                <div className={`rank-badge ${isFinalist(stat.rank) ? `rank-${stat.rank}` : ''}`}>
                                  {stat.rank}
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <div
                                    style={{
                                      width: '30px',
                                      height: '30px',
                                      borderRadius: '50%',
                                      overflow: 'hidden',
                                      border: '1px solid var(--brand-color)'
                                    }}
                                  >
                                    {team.photoUrl ? (
                                      <img
                                        src={team.photoUrl}
                                        alt={team.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'var(--brand-color-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--brand-color-dark)'
                                      }}>
                                        {team.name.substring(0, 1).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <span>{team.name}</span>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                {stat.matchesPlayed}
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                {stat.matchesWon}
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                                {stat.totalScore}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>No hay equipos con estadísticas disponibles.</p>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No hay ningún torneo activo.</p>
            <p>
              <Link to="/tournaments" className="link">
                Ir a Torneos
              </Link>
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RankingsPage;