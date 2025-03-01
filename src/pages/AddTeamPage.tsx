import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave, FaArrowLeft } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { createPlayer, createTeam, getCurrentTournament, addTeamToTournament } from '../services/dataService';
import { Tournament } from '../types';

const AddTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | undefined>(undefined);

  // Form state
  const [teamName, setTeamName] = useState('');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [teamPhoto, setTeamPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const currentTournament = getCurrentTournament();
    setTournament(currentTournament);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for simplicity
    const reader = new FileReader();
    reader.onloadend = () => {
      setTeamPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!teamName.trim() || !player1Name.trim() || !player2Name.trim()) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    if (!tournament) {
      setError('No hay un torneo activo para agregar equipos');
      setLoading(false);
      return;
    }

    try {
      // Create players
      const player1 = createPlayer(player1Name.trim());
      const player2 = createPlayer(player2Name.trim());

      // Create team
      const team = createTeam(teamName.trim(), player1, player2, teamPhoto || undefined);

      // Add team to tournament
      addTeamToTournament(tournament.id, team);

      // Show success message
      setSuccess(true);

      // Reset form
      setTeamName('');
      setPlayer1Name('');
      setPlayer2Name('');
      setTeamPhoto(null);

      // Navigate back after a delay
      setTimeout(() => {
        navigate('/teams');
      }, 1500);
    } catch (err) {
      setError('Ocurrió un error al crear el equipo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Agregar Equipo">
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => navigate('/teams')}
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

        {success ? (
          <div className="card" style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--brand-color-light)'
          }}>
            <h2 style={{ color: 'var(--brand-color-dark)' }}>¡Equipo creado con éxito!</h2>
            <p style={{ marginTop: '1rem' }}>
              Serás redirigido en unos instantes...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="card mb-3">
              <h2 className="mb-2">Información del Equipo</h2>

              {tournament ? (
                <p className="mb-2">Agregar equipo al torneo: <strong>{tournament.name}</strong></p>
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

              <div className="form-group">
                <label htmlFor="teamName" className="label">
                  Nombre del Equipo
                </label>
                <input
                  id="teamName"
                  type="text"
                  className="input"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Los Campeones"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="player1" className="label">
                    Jugador 1
                  </label>
                  <input
                    id="player1"
                    type="text"
                    className="input"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    placeholder="Juan"
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="player2" className="label">
                    Jugador 2
                  </label>
                  <input
                    id="player2"
                    type="text"
                    className="input"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Carlos"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="teamPhoto" className="label">
                  Foto del Equipo (opcional)
                </label>
                <input
                  id="teamPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{
                    marginTop: '0.5rem',
                    width: '100%'
                  }}
                />

                {teamPhoto && (
                  <div style={{
                    marginTop: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <img
                      src={teamPhoto}
                      alt="Vista previa del equipo"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="button button-primary w-full"
              disabled={loading || !tournament}
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
                  <FaSave /> Guardar Equipo
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default AddTeamPage;