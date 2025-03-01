import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import SimpleLayout from '../components/SimpleLayout';
import { getTournaments, deleteTournament } from '../services/dataService';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);
  const cancelRef = useRef(null);
  const navigate = useNavigate();

  const getBadgeColor = (status) => {
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

  const handleEditTournament = (id) => {
    navigate(`/tournaments/edit/${id}`);
  };

  const handleDeleteTournament = async () => {
    if (tournamentToDelete) {
      try {
        const result = deleteTournament(tournamentToDelete);
        if (result) {
          setTournaments(tournaments.filter(t => t.id !== tournamentToDelete));
          setShowConfirmDelete(false);
          setTournamentToDelete(null);
        } else {
          alert('Error al eliminar el torneo. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error deleting tournament:', error);
      }
    }
  };

  const confirmDelete = (id) => {
    setTournamentToDelete(id);
    setShowConfirmDelete(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return `${day} de ${month}, ${year}`;
    } catch (error) {
      return dateString;
    }
  };

  return (
    <SimpleLayout title="Torneos">
      <div className="page-actions" style={{ marginBottom: '1rem' }}>
        <Link to="/tournaments/add" className="button button-primary">
          <FaPlus style={{ marginRight: '0.5rem' }} /> Nuevo Torneo
        </Link>
      </div>

      {loading ? (
        <div className="loading-indicator">Cargando torneos...</div>
      ) : tournaments.length === 0 ? (
        <div className="empty-state">
          <p>No hay torneos disponibles.</p>
          <p>Crea un nuevo torneo para comenzar.</p>
        </div>
      ) : (
        <div className="tournaments-list">
          {tournaments.map(tournament => (
            <div className="card tournament-card" key={tournament.id}>
              <div className="tournament-card-content">
                <h2 className="tournament-title">{tournament.name}</h2>
                <div className="tournament-dates">
                  <p><strong>Inicio:</strong> {formatDate(tournament.startDate)}</p>
                  {tournament.endDate && (
                    <p><strong>Fin:</strong> {formatDate(tournament.endDate)}</p>
                  )}
                </div>
                <div className="tournament-stats">
                  <span>{tournament.teams.length} Equipos</span>
                  <span>{tournament.matches.length} Partidos</span>
                  <span className="tournament-status">
                    {tournament.grandFinalPlayed ? "Finalizado" : "En curso"}
                  </span>
                </div>
              </div>
              <div className="tournament-card-actions">
                <button
                  className="button button-outline"
                  style={{ marginRight: '0.5rem' }}
                  onClick={() => handleEditTournament(tournament.id)}
                >
                  <FaEdit style={{ marginRight: '0.25rem' }} /> Editar
                </button>
                <button
                  className="button button-danger-outline"
                  onClick={() => confirmDelete(tournament.id)}
                >
                  <FaTrash style={{ marginRight: '0.25rem' }} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro que deseas eliminar este torneo?
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button
                ref={cancelRef}
                className="button button-outline"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancelar
              </button>
              <button
                className="button button-danger"
                onClick={handleDeleteTournament}
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