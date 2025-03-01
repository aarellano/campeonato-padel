import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaUserFriends } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { getTeams, getCurrentTournament, deleteTeam } from '../services/dataService';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [tournament, setTournament] = useState(undefined);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const cancelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get all teams
    const allTeams = getTeams();
    setTeams(allTeams);

    // Get current tournament
    const currentTournament = getCurrentTournament();
    setTournament(currentTournament);
  }, []);

  const handleEditTeam = (id) => {
    navigate(`/teams/edit/${id}`);
  };

  const handleDeleteTeam = async () => {
    if (teamToDelete) {
      try {
        const result = deleteTeam(teamToDelete);
        if (result) {
          setTeams(teams.filter(t => t.id !== teamToDelete));
          setShowConfirmDelete(false);
          setTeamToDelete(null);
        } else {
          alert('Error al eliminar el equipo. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const confirmDelete = (id) => {
    setTeamToDelete(id);
    setShowConfirmDelete(true);
  };

  return (
    <MainLayout title="Equipos">
      <div style={{ marginTop: '1rem' }}>
        {/* Header with add button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2>
            {teams.length > 0
              ? `${teams.length} Equipos Participantes`
              : 'No hay equipos todavía'}
          </h2>

          <Link
            to="/teams/add"
            className="button button-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          >
            <FaPlus /> Agregar
          </Link>
        </div>

        {teams.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <FaUserFriends size={48} style={{ margin: '0 auto', color: 'var(--brand-color)' }} />
            <p style={{ marginTop: '1rem' }}>¡Aún no hay equipos registrados!</p>
            <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              Agrega equipos para comenzar el torneo.
            </p>
            <Link to="/teams/add" className="button button-primary">
              Agregar Equipo
            </Link>
          </div>
        ) : (
          <div>
            {teams.map(team => (
              <div key={team.id} className="team-card">
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--brand-color)'
                  }}
                >
                  {team.photoUrl ? (
                    <img
                      src={team.photoUrl}
                      alt={team.name}
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
                      {team.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {team.name}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {team.players[0].name} y {team.players[1].name}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="button button-outline"
                    onClick={() => handleEditTeam(team.id)}
                  >
                    <FaEdit style={{ marginRight: '0.25rem' }} /> Editar
                  </button>
                  <button
                    className="button button-danger-outline"
                    onClick={() => confirmDelete(team.id)}
                  >
                    <FaTrash style={{ marginRight: '0.25rem' }} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tournament && (
          <div
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: 'var(--brand-color-light)',
              borderRadius: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            <p>
              <strong>Torneo actual:</strong> {tournament.name}
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              {tournament.teams.length} equipos participan en este torneo
            </p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showConfirmDelete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirmar Eliminación</h3>
              <p>
                ¿Estás seguro que deseas eliminar este equipo?
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
                  onClick={handleDeleteTeam}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeamsPage;