import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { getCurrentTournament, getTeams, getMatches, getTeamById } from '../services/dataService';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [champion, setChampion] = useState(null);
  const [secondPlace, setSecondPlace] = useState(null);
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
  const getTeamStats = (teamId) => {
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
              backgroundColor: 'white',
              border: '2px solid silver'
            }}
          >
            <FaMedal style={{ color: 'silver', fontSize: '2rem', marginBottom: '0.5rem' }} />
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
              Segundo Lugar
            </h2>

            <div
              style={{
                backgroundColor: 'var(--background-color)',
                padding: '1.5rem',
                borderRadius: '1rem',
                maxWidth: '400px',
                margin: '0 auto'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 1rem auto',
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
                    backgroundColor: 'var(--brand-color-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--brand-color-dark)'
                  }}>
                    {secondPlace.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <h3 style={{ marginBottom: '0.5rem' }}>
                {secondPlace.name}
              </h3>

              <div className="mb-2">
                {secondPlace.players[0].name} y {secondPlace.players[1].name}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: '1rem'
                }}
              >
                {tournament && secondPlace && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Partidos</div>
                      <div style={{ fontWeight: 'bold' }}>
                        {getTeamStats(secondPlace.id).matches}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Victorias</div>
                      <div style={{ fontWeight: 'bold', color: 'green' }}>
                        {getTeamStats(secondPlace.id).wins}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Derrotas</div>
                      <div style={{ fontWeight: 'bold', color: 'red' }}>
                        {getTeamStats(secondPlace.id).losses}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {tournament && (
          <div className="card mb-3">
            <h3 className="mb-3">Resultados del Torneo</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>
                {tournament.name}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Fecha: {tournament.startDate} - {tournament.endDate || 'En curso'}
              </p>
              <p>
                {tournament.teams.length} equipos participantes
                • {matches.length} partidos jugados
              </p>
            </div>

            <h4 className="mb-2">Todos los Partidos</h4>

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
                    <th style={{ padding: '0.5rem' }}>Fecha</th>
                    <th style={{ padding: '0.5rem' }}>Equipos</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>Resultado</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map(match => {
                    const teamA = getTeamById(match.teamAId);
                    const teamB = getTeamById(match.teamBId);

                    if (!teamA || !teamB) return null;

                    return (
                      <tr
                        key={match.id}
                        style={{
                          borderBottom: '1px solid var(--brand-color-light)',
                          backgroundColor: match.isGrandFinal ? 'var(--brand-color-light)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {match.date}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>{teamA.name}</span>
                            <span>vs</span>
                            <span style={{ fontWeight: 'bold' }}>{teamB.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          <span style={{
                            fontWeight: 'bold',
                            color: match.teamAScore > match.teamBScore ? 'green' : 'inherit'
                          }}>
                            {match.teamAScore}
                          </span>
                          {' - '}
                          <span style={{
                            fontWeight: 'bold',
                            color: match.teamBScore > match.teamAScore ? 'green' : 'inherit'
                          }}>
                            {match.teamBScore}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          {match.isGrandFinal ? (
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '1rem',
                              backgroundColor: 'gold',
                              color: 'var(--text-color-dark)',
                              fontSize: '0.85rem',
                              fontWeight: 'bold'
                            }}>
                              FINAL
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '1rem',
                              backgroundColor: 'var(--brand-color-light)',
                              color: 'var(--brand-color-dark)',
                              fontSize: '0.85rem'
                            }}>
                              Regular
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            className="button button-primary"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResultsPage;