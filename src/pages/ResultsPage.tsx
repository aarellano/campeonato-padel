import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { getCurrentTournament, getTeams, getMatches, getTeamById } from '../services/dataService';
import { Tournament, Team, Match } from '../types';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [champion, setChampion] = useState<Team | null>(null);
  const [secondPlace, setSecondPlace] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);

      // Get current tournament
      const currentTournament = getCurrentTournament();
      if (!currentTournament || !currentTournament.grandFinalPlayed) {
        // Redirect if there's no tournament or grand final hasn't been played
        navigate('/');
        return;
      }

      setTournament(currentTournament);

      // Get all teams
      const allTeams = getTeams();
      setTeams(allTeams);

      // Get all matches
      const allMatches = getMatches(currentTournament.id);
      setMatches(allMatches);

      // Find the grand final match
      const grandFinalMatch = allMatches.find(match => match.isGrandFinal);

      if (grandFinalMatch) {
        // Determine champion and second place
        const teamA = getTeamById(grandFinalMatch.teamAId);
        const teamB = getTeamById(grandFinalMatch.teamBId);

        if (teamA && teamB) {
          if (grandFinalMatch.teamAScore > grandFinalMatch.teamBScore) {
            setChampion(teamA);
            setSecondPlace(teamB);
          } else {
            setChampion(teamB);
            setSecondPlace(teamA);
          }
        }
      }

      setLoading(false);
    };

    loadData();
  }, [navigate]);

  // Calculate team statistics
  const getTeamStats = (teamId: string) => {
    const teamMatches = matches.filter(
      match => match.teamAId === teamId || match.teamBId === teamId
    );

    let wins = 0;
    let losses = 0;
    let points = 0;

    teamMatches.forEach(match => {
      const isTeamA = match.teamAId === teamId;
      const teamScore = isTeamA ? match.teamAScore : match.teamBScore;
      const opponentScore = isTeamA ? match.teamBScore : match.teamAScore;

      if (teamScore > opponentScore) {
        wins++;
        points += 3;
      } else {
        losses++;
      }
    });

    return {
      matches: teamMatches.length,
      wins,
      losses,
      points
    };
  };

  if (loading) {
    return (
      <MainLayout title="Resultados">
        <div className="card text-center" style={{ padding: '2rem' }}>
          <p>Cargando resultados...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Resultados Finales">
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          className="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            backgroundColor: 'transparent',
            color: 'var(--brand-color)',
            padding: '0.5rem'
          }}
        >
          <FaArrowLeft /> Volver al Inicio
        </button>

        {champion && (
          <div
            className="card mb-3"
            style={{
              textAlign: 'center',
              padding: '1.5rem',
              position: 'relative',
              backgroundColor: 'var(--brand-color-light)',
              border: '3px solid gold',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                backgroundColor: 'gold',
                width: '80px',
                height: '80px',
                transform: 'rotate(45deg)',
                zIndex: 1
              }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <FaTrophy style={{ color: 'gold', fontSize: '3rem', marginBottom: '0.5rem' }} />
              <h2 style={{ marginBottom: '1rem', color: 'var(--brand-color-dark)' }}>
                ¡Equipo Campeón!
              </h2>

              <div
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  maxWidth: '400px',
                  margin: '0 auto',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 1rem auto',
                    border: '3px solid gold'
                  }}
                >
                  {champion.photoUrl ? (
                    <img
                      src={champion.photoUrl}
                      alt={champion.name}
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
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: 'var(--brand-color-dark)'
                    }}>
                      {champion.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}
                >
                  {champion.name}
                </h3>

                <div className="mb-2">
                  {champion.players[0].name} y {champion.players[1].name}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}
                >
                  {tournament && champion && (
                    <>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Partidos</div>
                        <div style={{ fontWeight: 'bold' }}>
                          {getTeamStats(champion.id).matches}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Victorias</div>
                        <div style={{ fontWeight: 'bold', color: 'green' }}>
                          {getTeamStats(champion.id).wins}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Derrotas</div>
                        <div style={{ fontWeight: 'bold', color: 'red' }}>
                          {getTeamStats(champion.id).losses}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {secondPlace && (
          <div
            className="card mb-3"
            style={{
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: '#f5f5f5',
              border: '2px solid silver'
            }}
          >
            <FaMedal style={{ color: 'silver', fontSize: '2rem', marginBottom: '0.5rem' }} />
            <h3 style={{ marginBottom: '1rem', color: '#555' }}>
              Subcampeón
            </h3>

            <div
              style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '1rem',
                maxWidth: '350px',
                margin: '0 auto',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 0.75rem auto',
                  border: '2px solid silver'
                }}
              >
                {secondPlace.photoUrl ? (
                  <img
                    src={secondPlace.photoUrl}
                    alt={secondPlace.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#555'
                  }}>
                    {secondPlace.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <h4
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem'
                }}
              >
                {secondPlace.name}
              </h4>

              <div className="mb-2">
                {secondPlace.players[0].name} y {secondPlace.players[1].name}
              </div>
            </div>
          </div>
        )}

        <div className="card mb-3">
          <h3 className="mb-3" style={{ textAlign: 'center' }}>
            Tabla Final de Posiciones
          </h3>

          <div className="responsive-table">
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '10%', textAlign: 'center' }}>Pos</th>
                  <th style={{ width: '40%', textAlign: 'left' }}>Equipo</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>PJ</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>G</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>P</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {teams
                  .map(team => ({
                    team,
                    stats: getTeamStats(team.id)
                  }))
                  .sort((a, b) => {
                    // Special sort: champion always first, second place always second
                    if (champion && a.team.id === champion.id) return -1;
                    if (champion && b.team.id === champion.id) return 1;
                    if (secondPlace && a.team.id === secondPlace.id) return -1;
                    if (secondPlace && b.team.id === secondPlace.id) return 1;

                    // Then sort by points
                    return b.stats.points - a.stats.points;
                  })
                  .map((item, index) => (
                    <tr key={item.team.id} style={{
                      backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' :
                                       index === 1 ? 'rgba(192, 192, 192, 0.1)' :
                                       'transparent'
                    }}>
                      <td style={{ textAlign: 'center' }}>
                        {index === 0 ? (
                          <FaTrophy style={{ color: 'gold' }} />
                        ) : index === 1 ? (
                          <FaMedal style={{ color: 'silver' }} />
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              backgroundColor: 'var(--brand-color-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              color: 'var(--brand-color-dark)',
                              flexShrink: 0
                            }}
                          >
                            {item.team.photoUrl ? (
                              <img
                                src={item.team.photoUrl}
                                alt={item.team.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              item.team.name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <span>{item.team.name}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.stats.matches}</td>
                      <td style={{ textAlign: 'center', color: 'green' }}>{item.stats.wins}</td>
                      <td style={{ textAlign: 'center', color: 'red' }}>{item.stats.losses}</td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.stats.points}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card mb-3">
          <h3 className="mb-3" style={{ textAlign: 'center' }}>
            Todos los Partidos
          </h3>

          <div className="responsive-table">
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '35%', textAlign: 'right' }}>Equipo</th>
                  <th style={{ width: '20%', textAlign: 'center' }}>Resultado</th>
                  <th style={{ width: '35%', textAlign: 'left' }}>Equipo</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Final</th>
                </tr>
              </thead>
              <tbody>
                {matches
                  .sort((a, b) => {
                    // Grand final at the top
                    if (a.isGrandFinal) return -1;
                    if (b.isGrandFinal) return 1;
                    return 0;
                  })
                  .map(match => {
                    const teamA = teams.find(t => t.id === match.teamAId);
                    const teamB = teams.find(t => t.id === match.teamBId);

                    return (
                      <tr
                        key={match.id}
                        style={{
                          backgroundColor: match.isGrandFinal ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                        }}
                      >
                        <td style={{ textAlign: 'right' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '0.5rem'
                          }}>
                            <span>{teamA?.name || 'Equipo A'}</span>
                            <div
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                backgroundColor: 'var(--brand-color-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                color: 'var(--brand-color-dark)',
                                flexShrink: 0
                              }}
                            >
                              {teamA?.photoUrl ? (
                                <img
                                  src={teamA.photoUrl}
                                  alt={teamA.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                teamA?.name.substring(0, 2).toUpperCase() || 'A'
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          backgroundColor: match.isGrandFinal ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'
                        }}>
                          {match.teamAScore} - {match.teamBScore}
                        </td>
                        <td>
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
                                backgroundColor: 'var(--brand-color-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                color: 'var(--brand-color-dark)',
                                flexShrink: 0
                              }}
                            >
                              {teamB?.photoUrl ? (
                                <img
                                  src={teamB.photoUrl}
                                  alt={teamB.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                teamB?.name.substring(0, 2).toUpperCase() || 'B'
                              )}
                            </div>
                            <span>{teamB?.name || 'Equipo B'}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {match.isGrandFinal && (
                            <FaTrophy style={{ color: 'gold' }} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            className="button button-primary"
            style={{ maxWidth: '300px', margin: '0 auto' }}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResultsPage;