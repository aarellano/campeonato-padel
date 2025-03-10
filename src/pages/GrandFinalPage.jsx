import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaFlagCheckered, FaCrown, FaFireAlt } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { getCurrentTournament, getTopTwoTeams, createMatch } from '../services/dataService';
import ReactConfetti from 'react-confetti';

const GrandFinalPage = () => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(undefined);
  const [finalists, setFinalists] = useState([undefined, undefined]);

  // Form state
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Get current tournament
    const currentTournament = getCurrentTournament();
    setTournament(currentTournament);

    if (currentTournament) {
      // Check if tournament already has grand final
      if (currentTournament.grandFinalPlayed) {
        navigate('/results');
        return;
      }

      // Get top two teams
      const top2Teams = getTopTwoTeams(currentTournament.id);
      setFinalists(top2Teams);

      if (!top2Teams[0] || !top2Teams[1]) {
        // Not enough data to determine finalists
        navigate('/rankings');
      }
    }
  }, [navigate]);

  const handleScoreChange = (team, value) => {
    const score = Math.max(0, value); // Ensure score is not negative

    if (team === 'A') {
      setTeamAScore(score);
    } else {
      setTeamBScore(score);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!tournament) {
      setError('No hay un torneo activo');
      setLoading(false);
      return;
    }

    if (!finalists[0] || !finalists[1]) {
      setError('No se han determinado los finalistas');
      setLoading(false);
      return;
    }

    try {
      // Create the grand final match
      createMatch(
        tournament.id,
        finalists[0].id,
        finalists[1].id,
        teamAScore,
        teamBScore,
        true // This is the grand final
      );

      // Determine the winner
      if (teamAScore > teamBScore) {
        setWinner(finalists[0]);
      } else {
        setWinner(finalists[1]);
      }

      // Show success and confetti
      setSuccess(true);
      setShowConfetti(true);

      // Navigate to results after a delay
      setTimeout(() => {
        navigate('/results');
      }, 5000); // Wait 5 seconds to show the celebration
    } catch (err) {
      setError('Ocurrió un error al registrar el resultado de la Gran Final');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success && winner) {
    return (
      <MainLayout title="¡Campeón!">
        <div style={{ marginTop: '1rem', position: 'relative' }}>
          {showConfetti && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}>
              <ReactConfetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={500}
              />
            </div>
          )}

          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: 'var(--brand-color-light)',
              border: '3px solid gold',
              position: 'relative',
              zIndex: 10
            }}
          >
            <FaTrophy style={{ fontSize: '4rem', color: 'gold', marginBottom: '1rem' }} />
            <h2 style={{ color: 'var(--brand-color-dark)', marginBottom: '1rem' }}>
              ¡Tenemos un campeón!
            </h2>

            <div
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                marginBottom: '1.5rem',
                position: 'relative'
              }}
            >
              <FaCrown
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '2rem',
                  color: 'gold'
                }}
              />

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
                {winner.photoUrl ? (
                  <img
                    src={winner.photoUrl}
                    alt={winner.name}
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
                    {winner.name.substring(0, 2).toUpperCase()}
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
                {winner.name}
              </h3>

              <p>
                {winner.players[0].name} y {winner.players[1].name}
              </p>
            </div>

            <p style={{ marginBottom: '1rem' }}>
              ¡Felicitaciones al equipo campeón!
            </p>

            <div
              style={{
                marginTop: '1rem',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--highlight-color)',
                color: 'white'
              }}
            >
              <FaFireAlt style={{ marginRight: '0.5rem' }} />
              Serás redirigido a los resultados...
            </div>

            <style>
              {`
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
                }
              `}
            </style>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Gran Final">
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/rankings')}
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
          <FaArrowLeft /> Volver al Ranking
        </button>

        <div className="card mb-3">
          <h2 className="mb-3">La Gran Final</h2>

          {finalists[0] && finalists[1] ? (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Team A */}
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    minWidth: '150px'
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      margin: '0 auto 0.5rem auto',
                      border: '2px solid var(--brand-color)'
                    }}
                  >
                    {finalists[0].photoUrl ? (
                      <img
                        src={finalists[0].photoUrl}
                        alt={finalists[0].name}
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
                        {finalists[0].name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {finalists[0].name}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {finalists[0].players[0].name} y {finalists[0].players[1].name}
                  </p>
                </div>

                {/* VS */}
                <div
                  style={{
                    textAlign: 'center',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--brand-color)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '1rem'
                  }}
                >
                  VS
                </div>

                {/* Team B */}
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    minWidth: '150px'
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      margin: '0 auto 0.5rem auto',
                      border: '2px solid var(--brand-color)'
                    }}
                  >
                    {finalists[1].photoUrl ? (
                      <img
                        src={finalists[1].photoUrl}
                        alt={finalists[1].name}
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
                        {finalists[1].name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {finalists[1].name}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {finalists[1].players[0].name} y {finalists[1].players[1].name}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <h3 className="mb-2">Ingresar Resultado</h3>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Team A Score */}
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <label
                        htmlFor="teamAScore"
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        {finalists[0].name}
                      </label>
                      <input
                        id="teamAScore"
                        type="number"
                        min="0"
                        value={teamAScore}
                        onChange={(e) => handleScoreChange('A', parseInt(e.target.value))}
                        className="form-input"
                        style={{
                          width: '100%',
                          fontSize: '1.5rem',
                          textAlign: 'center',
                          borderRadius: '0.5rem',
                          border: '2px solid var(--brand-color)'
                        }}
                      />
                    </div>

                    <div
                      style={{
                        padding: '0.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      -
                    </div>

                    {/* Team B Score */}
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <label
                        htmlFor="teamBScore"
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        {finalists[1].name}
                      </label>
                      <input
                        id="teamBScore"
                        type="number"
                        min="0"
                        value={teamBScore}
                        onChange={(e) => handleScoreChange('B', parseInt(e.target.value))}
                        className="form-input"
                        style={{
                          width: '100%',
                          fontSize: '1.5rem',
                          textAlign: 'center',
                          borderRadius: '0.5rem',
                          border: '2px solid var(--brand-color)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="error-message mb-3">
                    {error}
                  </div>
                )}

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="submit"
                    className="button button-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    disabled={loading}
                  >
                    <FaFlagCheckered /> Finalizar Torneo
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <p>
                No hay suficiente información para determinar los finalistas.
              </p>
              <p>
                <button
                  onClick={() => navigate('/rankings')}
                  className="button button-primary"
                >
                  Ver Ranking
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default GrandFinalPage;