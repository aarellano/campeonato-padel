import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { getMatches, getTeam, getCurrentTournament } from '../services/dataService';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current tournament
        const currentTournament = getCurrentTournament();
        setTournament(currentTournament);

        // Get all matches for the current tournament
        if (currentTournament) {
          const matchesData = getMatches(currentTournament.id);
          setMatches(matchesData);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get team name by ID
  const getTeamName = (teamId) => {
    const team = getTeam(teamId);
    return team ? team.name : 'Equipo Desconocido';
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <MainLayout title="Partidos">
      <div style={{ marginTop: '1rem' }}>
        {/* Header with add button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2>
            {matches.length > 0
              ? `${matches.length} Partidos`
              : 'No hay partidos programados'}
          </h2>

          <Link
            to="/matches/add"
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

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando partidos...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ marginTop: '1rem' }}>¡Aún no hay partidos programados!</p>
            <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              Agrega partidos para comenzar el torneo.
            </p>
            <Link to="/matches/add" className="button button-primary">
              Agregar Partido
            </Link>
          </div>
        ) : (
          <div>
            {matches.map(match => (
              <div
                key={match.id}
                className="card"
                style={{
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => navigate(`/matches/${match.id}`)}
              >
                {match.isGrandFinal && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'gold',
                      color: '#333',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      transform: 'rotate(45deg) translate(0, -50%)',
                      transformOrigin: 'center right'
                    }}
                  >
                    FINAL
                  </div>
                )}

                <div style={{ padding: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <h3 style={{ fontWeight: 'bold' }}>{getTeamName(match.teamAId)}</h3>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0 1rem'
                    }}>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        margin: '0.5rem 0'
                      }}>
                        {match.teamAScore} - {match.teamBScore}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-color-muted)'
                      }}>
                        {formatDate(match.date)}
                      </div>
                    </div>

                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <h3 style={{ fontWeight: 'bold' }}>{getTeamName(match.teamBId)}</h3>
                    </div>
                  </div>

                  {match.teamAScore === 0 && match.teamBScore === 0 && (
                    <div style={{
                      textAlign: 'center',
                      marginTop: '0.5rem',
                      padding: '0.25rem',
                      backgroundColor: 'var(--brand-color-light)',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      Partido pendiente
                    </div>
                  )}
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
      </div>
    </MainLayout>
  );
};

export default MatchesPage;