import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLayout from '../components/SimpleLayout';
import { createMatch, getTeams, getCurrentTournament } from '../services/dataService';

const AddMatchPage = () => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [isGrandFinal, setIsGrandFinal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tournament, setTournament] = useState(undefined);
  const [availableTeams, setAvailableTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current tournament
    const currentTournament = getCurrentTournament();
    if (!currentTournament) {
      alert('No hay un torneo activo. Por favor crea un torneo primero.');
      navigate('/tournaments');
      return;
    }

    setTournament(currentTournament);

    // Get teams for this tournament
    if (currentTournament && currentTournament.teams) {
      setAvailableTeams(currentTournament.teams);
    } else {
      // If no teams in tournament, get all teams
      const allTeams = getTeams();
      setAvailableTeams(allTeams);
    }

    // Set default date to today
    const today = new Date();
    setMatchDate(today.toISOString().split('T')[0]);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Form validation
      if (!teamA || !teamB) {
        alert('Por favor selecciona ambos equipos');
        setIsSubmitting(false);
        return;
      }

      if (teamA === teamB) {
        alert('No puedes seleccionar el mismo equipo dos veces');
        setIsSubmitting(false);
        return;
      }

      if (!tournament) {
        alert('No hay un torneo activo. Por favor crea un torneo primero.');
        navigate('/tournaments');
        return;
      }

      // Create match
      const match = createMatch(
        tournament.id,
        teamA,
        teamB,
        matchDate ? new Date(matchDate).toISOString() : new Date().toISOString(),
        isGrandFinal
      );

      // Show success and redirect
      alert('Partido creado con éxito');
      navigate('/matches');
    } catch (error) {
      console.error('Error creating match:', error);
      alert(`Error al crear el partido: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <SimpleLayout title="Agregar Partido">
      <div className="card" style={{
        padding: '1.5rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {tournament ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Torneo: {tournament.name}</h3>
            <p style={{ color: 'var(--text-color-muted)', fontSize: '0.9rem' }}>
              {tournament.teams.length} equipos en este torneo
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem', color: 'var(--danger-color)' }}>
            <p>No hay un torneo activo. Por favor crea un torneo primero.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="teamA"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--text-color)',
                fontFamily: 'Space Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem'
              }}
            >
              Equipo A
            </label>
            <select
              id="teamA"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              disabled={!tournament}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '2px solid var(--text-color-light)',
                backgroundColor: tournament ? 'white' : '#f5f5f5',
                fontSize: '1rem',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              required
            >
              <option value="">Seleccionar equipo</option>
              {availableTeams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="teamB"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--text-color)',
                fontFamily: 'Space Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem'
              }}
            >
              Equipo B
            </label>
            <select
              id="teamB"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              disabled={!tournament}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '2px solid var(--text-color-light)',
                backgroundColor: tournament ? 'white' : '#f5f5f5',
                fontSize: '1rem',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              required
            >
              <option value="">Seleccionar equipo</option>
              {availableTeams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="matchDate"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--text-color)',
                fontFamily: 'Space Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem'
              }}
            >
              Fecha del Partido
            </label>
            <input
              id="matchDate"
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              disabled={!tournament}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '2px solid var(--text-color-light)',
                backgroundColor: tournament ? 'white' : '#f5f5f5',
                fontSize: '1rem',
                transition: 'all 0.3s',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: tournament ? 'pointer' : 'not-allowed',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={isGrandFinal}
                onChange={(e) => setIsGrandFinal(e.target.checked)}
                disabled={!tournament}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{
                color: isGrandFinal ? 'var(--active-color)' : 'var(--text-color)',
                fontWeight: isGrandFinal ? 'bold' : 'normal'
              }}>
                Este es el partido de la Gran Final
              </span>
            </label>
            {isGrandFinal && (
              <p style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                Nota: Marcar un partido como la Gran Final completará el torneo cuando se registre el resultado.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => navigate('/matches')}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '4px',
                border: '1px solid var(--text-color-light)',
                backgroundColor: 'var(--background-color)',
                color: 'var(--text-color)',
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'Space Mono, monospace',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !tournament}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: tournament ? 'var(--brand-color)' : '#cccccc',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'Space Mono, monospace',
                cursor: isSubmitting || !tournament ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: tournament ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
              }}
            >
              {isSubmitting ? 'Creando...' : 'Crear Partido'}
            </button>
          </div>
        </form>
      </div>
    </SimpleLayout>
  );
};

export default AddMatchPage;