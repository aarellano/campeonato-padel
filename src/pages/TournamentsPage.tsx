import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLayout from '../components/SimpleLayout';
import { getTournaments, deleteTournament } from '../services/dataService';
import { Tournament } from '../types';

const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { bg: 'var(--upcoming-color)', text: 'white' };
      case 'active':
        return { bg: 'var(--active-color)', text: 'white' };
      case 'completed':
        return { bg: 'var(--completed-color)', text: 'white' };
      default:
        return { bg: 'var(--text-color-light)', text: 'white' };
    }
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = getTournaments();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const handleAddTournament = () => {
    navigate('/tournaments/add');
  };

  const handleEditTournament = (id: string) => {
    navigate(`/tournaments/edit/${id}`);
  };

  const handleDeleteTournament = async () => {
    if (tournamentToDelete) {
      try {
        deleteTournament(tournamentToDelete);
        setTournaments(tournaments.filter(t => t.id !== tournamentToDelete));
        setShowConfirmDelete(false);
        setTournamentToDelete(null);
      } catch (error) {
        console.error('Error deleting tournament:', error);
      }
    }
  };

  const confirmDelete = (id: string) => {
    setTournamentToDelete(id);
    setShowConfirmDelete(true);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <SimpleLayout title="Torneos">
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleAddTournament}
          style={{
            backgroundColor: 'var(--brand-color)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s',
            fontFamily: 'Space Mono, monospace',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Nuevo Torneo
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando torneos...</div>
      ) : tournaments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '8px',
          boxShadow: 'var(--card-shadow)',
          border: '1px solid #e0e0e0'
        }}>
          <p>No hay torneos disponibles</p>
        </div>
      ) : (
        <div>
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              style={{
                marginBottom: '1rem',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '8px',
                boxShadow: 'var(--card-shadow)',
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                transition: 'all 0.3s',
              }}
              onClick={() => navigate(`/tournaments/${tournament.id}`)}
            >
              <div style={{
                padding: '1rem',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.2rem' }}>{tournament.name}</h3>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: getBadgeColor(tournament.status).bg,
                      color: getBadgeColor(tournament.status).text
                    }}
                  >
                    {tournament.status === 'upcoming' ? 'Próximo' :
                     tournament.status === 'active' ? 'Activo' : 'Completado'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                  color: 'var(--text-color-muted)'
                }}>
                  <div>Equipos: {tournament.teams?.length || 0}</div>
                  <div>Partidos: {tournament.matches?.length || 0}</div>
                </div>

                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-color-muted)' }}>
                  {tournament.startDate && (
                    <div>Inicio: {formatDate(tournament.startDate)}</div>
                  )}
                </div>
              </div>

              <div style={{
                display: 'flex',
                borderTop: '1px solid #e0e0e0',
                backgroundColor: 'rgba(0,0,0,0.03)'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTournament(tournament.id);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRight: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    color: 'var(--brand-color)',
                    fontWeight: 'bold',
                    transition: 'background 0.3s'
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(tournament.id);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--danger-color)',
                    fontWeight: 'bold',
                    transition: 'background 0.3s'
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {showConfirmDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: 'var(--card-shadow)',
            overflow: 'hidden',
            border: '2px solid var(--danger-color)'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: 'var(--danger-color)',
              color: 'white',
              fontWeight: 'bold'
            }}>
              Confirmar Eliminación
            </div>
            <div style={{ padding: '1rem' }}>
              <p>¿Estás seguro que deseas eliminar este torneo? Esta acción no se puede deshacer.</p>
            </div>
            <div style={{
              display: 'flex',
              borderTop: '1px solid #e0e0e0',
              padding: '0.5rem'
            }}>
              <button
                ref={cancelRef}
                onClick={() => setShowConfirmDelete(false)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  margin: '0 0.5rem',
                  backgroundColor: 'var(--background-color)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTournament}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  margin: '0 0.5rem',
                  backgroundColor: 'var(--danger-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </SimpleLayout>
  );
};

export default TournamentsPage;