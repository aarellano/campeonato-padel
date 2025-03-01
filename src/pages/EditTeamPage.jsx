import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleLayout from '../components/SimpleLayout';
import { getTeam, getPlayers, updateTeam } from '../services/dataService';

const EditTeamPage = () => {
  const { id } = useParams();
  const [teamName, setTeamName] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load team data
    const team = getTeam(id);
    if (!team) {
      alert('Equipo no encontrado');
      navigate('/teams');
      return;
    }

    setTeamName(team.name);
    setPlayer1(team.players[0].id);
    setPlayer2(team.players[1].id);

    // Load available players
    const players = getPlayers();
    setAvailablePlayers(players);
  }, [id, navigate]);

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

      // Update team
      updateTeam(id, {
        name: teamName.trim(),
        players: [player1, player2]
      });

      // Show success and redirect
      alert('Equipo actualizado con éxito');
      navigate('/teams');
    } catch (error) {
      console.error('Error updating team:', error);
      alert(`Error al actualizar el equipo: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <SimpleLayout title="Editar Equipo">
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
              {isSubmitting ? 'Actualizando...' : 'Actualizar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </SimpleLayout>
  );
};

export default EditTeamPage;