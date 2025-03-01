import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { getCurrentTournament, getTeamById, getMissingMatches, createMatch } from '../services/dataService';
import { Team, Tournament } from '../types';

const AddMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | undefined>(undefined);
  const [missingMatchups, setMissingMatchups] = useState<{teamA: Team, teamB: Team}[]>([]);

  // Form state
  const [selectedMatchup, setSelectedMatchup] = useState<{teamA: Team, teamB: Team} | null>(null);
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get current tournament
    const currentTournament = getCurrentTournament();
    setTournament(currentTournament);

    if (currentTournament) {
      // Get missing matchups
      const missing = getMissingMatches(currentTournament.id);
      setMissingMatchups(missing);

      // Set default selected matchup if there are any missing matchups
      if (missing.length > 0) {
        setSelectedMatchup(missing[0]);
      }
    }
  }, []);

  const handleSelectMatchup = (matchup: {teamA: Team, teamB: Team}) => {
    setSelectedMatchup(matchup);
    setTeamAScore(0);
    setTeamBScore(0);
  };

  const handleScoreChange = (team: 'A' | 'B', value: number) => {
    const score = Math.max(0, value); // Ensure score is not negative

    if (team === 'A') {
      setTeamAScore(score);
    } else {
      setTeamBScore(score);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!tournament) {
      setError('No hay un torneo activo para registrar partidos');
      setLoading(false);
      return;
    }

    if (!selectedMatchup) {
      setError('Debes seleccionar un partido para registrar el resultado');
      setLoading(false);
      return;
    }

    try {
      // Create match result
      createMatch(
        tournament.id,
        selectedMatchup.teamA.id,
        selectedMatchup.teamB.id,
        teamAScore,
        teamBScore
      );

      // Show success message
      setSuccess(true);

      // Reset form
      if (missingMatchups.length > 1) {
        // Remove the submitted matchup and select the next one
        const nextMatchups = missingMatchups.filter(
          m => m.teamA.id !== selectedMatchup.teamA.id || m.teamB.id !== selectedMatchup.teamB.id
        );
        setMissingMatchups(nextMatchups);

        if (nextMatchups.length > 0) {
          setSelectedMatchup(nextMatchups[0]);
          setTeamAScore(0);
          setTeamBScore(0);
          setSuccess(false); // Reset success to continue adding more
        } else {
          // No more matchups, navigate back after a delay
          setTimeout(() => {
            navigate('/matches');
          }, 1500);
        }
      } else {
        // Last matchup, navigate back after a delay
        setTimeout(() => {
          navigate('/matches');
        }, 1500);
      }
    } catch (err) {
      setError('Ocurrió un error al registrar el resultado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Registrar Resultado">
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/matches')}
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
          <FaArrowLeft /> Volver
        </button>

        {success && missingMatchups.length === 0 ? (
          <div className="card" style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--brand-color-light)'
          }}>
            <h2 style={{ color: 'var(--brand-color-dark)' }}>¡Resultado registrado con éxito!</h2>
            <p style={{ marginTop: '1rem' }}>
              Serás redirigido en unos instantes...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="card mb-3">
              <h2 className="mb-2">Ingresar Resultado</h2>

              {tournament ? (
                missingMatchups.length > 0 ? (
                  <p className="mb-2">
                    Quedan <strong>{missingMatchups.length}</strong> partidos por jugar
                  </p>
                ) : (
                  <p className="status-completed mb-2">
                    ¡Todos los partidos ya han sido jugados!
                  </p>
                )
              ) : (
                <p className="status-pending mb-2">
                  ⚠️ No hay un torneo activo. Crea un torneo primero.
                </p>
              )}

              {error && (
                <div style={{
                  padding: '0.5rem',
                  backgroundColor: '#FFEBEE',
                  color: '#D32F2F',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  padding: '0.5rem',
                  backgroundColor: '#E8F5E9',
                  color: '#2E7D32',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  ¡Resultado registrado correctamente! Puedes seguir registrando más resultados.
                </div>
              )}

              {missingMatchups.length > 0 && (
                <>
                  <div className="form-group">
                    <label htmlFor="matchup" className="label">
                      Seleccionar Partido
                    </label>
                    <select
                      id="matchup"
                      className="input"
                      value={`${selectedMatchup?.teamA.id}-${selectedMatchup?.teamB.id}`}
                      onChange={(e) => {
                        const [teamAId, teamBId] = e.target.value.split('-');
                        const matchup = missingMatchups.find(
                          m => m.teamA.id === teamAId && m.teamB.id === teamBId
                        );
                        if (matchup) {
                          handleSelectMatchup(matchup);
                        }
                      }}
                    >
                      {missingMatchups.map(matchup => (
                        <option
                          key={`${matchup.teamA.id}-${matchup.teamB.id}`}
                          value={`${matchup.teamA.id}-${matchup.teamB.id}`}
                        >
                          {matchup.teamA.name} vs {matchup.teamB.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedMatchup && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                      }}>
                        <div style={{
                          flex: 1,
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}>
                          {selectedMatchup.teamA.name}
                        </div>
                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          vs
                        </div>
                        <div style={{
                          flex: 1,
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}>
                          {selectedMatchup.teamB.name}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <label htmlFor="teamAScore" className="label">
                            Resultado
                          </label>
                          <input
                            id="teamAScore"
                            type="number"
                            min="0"
                            className="input"
                            value={teamAScore}
                            onChange={(e) => handleScoreChange('A', parseInt(e.target.value) || 0)}
                            style={{ textAlign: 'center', maxWidth: '80px' }}
                          />
                        </div>

                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          marginTop: '1.5rem'
                        }}>
                          -
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <label htmlFor="teamBScore" className="label">
                            Resultado
                          </label>
                          <input
                            id="teamBScore"
                            type="number"
                            min="0"
                            className="input"
                            value={teamBScore}
                            onChange={(e) => handleScoreChange('B', parseInt(e.target.value) || 0)}
                            style={{ textAlign: 'center', maxWidth: '80px' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              type="submit"
              className="button button-primary w-full"
              disabled={loading || !tournament || missingMatchups.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                'Guardando...'
              ) : (
                <>
                  <FaSave /> Guardar Resultado
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default AddMatchPage;