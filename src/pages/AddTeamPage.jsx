import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLayout from '../components/SimpleLayout';
import { createTeam, getPlayers, createPlayer } from '../services/dataService';

const AddTeamPage = () => {
  const [teamName, setTeamName] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load existing players
    const players = getPlayers();
    setAvailablePlayers(players);
  }, []);

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    // Create new player
    const player = createPlayer(newPlayerName);
    setAvailablePlayers([...availablePlayers, player]);
    setNewPlayerName('');
    setShowAddPlayer(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Form validation
      if (!teamName.trim()) {
        alert('Por favor ingresa un nombre para el equipo');
        setIsSubmitting(false);
        return;
      }

      if (!player1 || !player2) {
        alert('Por favor selecciona ambos jugadores');
        setIsSubmitting(false);
        return;
      }

      if (player1 === player2) {
        alert('No puedes seleccionar el mismo jugador dos veces');
        setIsSubmitting(false);
        return;
      }

      // Create team
      createTeam(teamName.trim(), [player1, player2]);

      // Show success and redirect
      alert('Equipo creado con éxito');
      navigate('/teams');
    } catch (error) {
      console.error('Error creating team:', error);
      alert(`Error al crear el equipo: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <SimpleLayout title="Agregar Equipo">
      <div className="card" style={{
        padding: '1.5rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="teamName"
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
              Nombre del Equipo
            </label>
            <input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ej: Las Águilas"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '2px solid var(--text-color-light)',
                backgroundColor: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="player1"
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
              Jugador 1
            </label>
            <select
              id="player1"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '2px solid var(--text-color-light)',
                backgroundColor: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              required
            >
              <option value="">Seleccionar jugador</option>
              {availablePlayers.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="player2"
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
              Jugador 2
            </label>
            <select
              id="player2"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '2px solid var(--text-color-light)',
                backgroundColor: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              required
            >
              <option value="">Seleccionar jugador</option>
              {availablePlayers.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          {!showAddPlayer ? (
            <button
              type="button"
              onClick={() => setShowAddPlayer(true)}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1.5rem',
                backgroundColor: 'var(--background-color)',
                color: 'var(--brand-color)',
                border: '1px dashed var(--brand-color)',
                borderRadius: '4px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              + Agregar nuevo jugador
            </button>
          ) : (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Agregar Nuevo Jugador</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Nombre del jugador"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddPlayer}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--brand-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    color: 'var(--text-color-muted)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/teams')}
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
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'var(--brand-color)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'Space Mono, monospace',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              {isSubmitting ? 'Creando...' : 'Crear Equipo'}
            </button>
          </div>
        </form>
      </div>
    </SimpleLayout>
  );
};

export default AddTeamPage;