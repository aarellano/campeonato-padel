import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaUsers, FaFutbol, FaTableTennis, FaCrown, FaMedal, FaCalendarAlt } from 'react-icons/fa';
import SimpleLayout from '../components/SimpleLayout';
import { getCurrentTournament, getTeams, getMatches } from '../services/dataService';

const HomePage = () => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(undefined);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Get current tournament
    const currentTournament = getCurrentTournament();
    setTournament(currentTournament);

    // Get teams
    const allTeams = getTeams();
    setTeams(allTeams);

    // Get matches
    if (currentTournament) {
      const tournamentMatches = getMatches(currentTournament.id);
      setMatches(tournamentMatches);
    }
  }, []);

  return (
    <SimpleLayout title="Campeonato de Padel 🎾">
      <div style={{ padding: '1rem' }}>
        <div className="card mb-3">
          <h2 className="mb-3">¡Bienvenidos al Campeonato!</h2>
          <p className="mb-3">
            Organiza y gestiona tu torneo de padel de manera fácil y divertida.
          </p>
          <div className="fun-quote mb-3">
            "El padel no es solo un deporte, es una forma de vida."
          </div>
        </div>

        <div className="menu-grid">
          <div
            className="menu-item"
            onClick={() => navigate('/tournaments')}
            style={{ backgroundColor: 'var(--color-6)', position: 'relative' }}
          >
            <FaCalendarAlt className="menu-icon" />
            <h3>Torneos</h3>
            <p>Gestionar torneos</p>
          </div>

          <div
            className="menu-item"
            onClick={() => navigate('/teams')}
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <FaUsers className="menu-icon" />
            <h3>Equipos</h3>
            <p>{teams.length} equipos</p>
          </div>

          <div
            className="menu-item"
            onClick={() => navigate('/matches')}
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <FaTableTennis className="menu-icon" />
            <h3>Partidos</h3>
            <p>{matches.length} partidos</p>
          </div>

          <div
            className="menu-item"
            onClick={() => navigate('/rankings')}
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <FaTrophy className="menu-icon" />
            <h3>Ranking</h3>
            <p>Clasificación actual</p>
          </div>

          <div
            className="menu-item"
            onClick={() => navigate('/grand-final')}
            style={{
              backgroundColor: 'var(--card-bg)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
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
            <FaCrown className="menu-icon" style={{ color: 'gold' }} />
            <h3>Gran Final</h3>
            <p>¡El gran partido final!</p>
          </div>

          {tournament?.grandFinalPlayed && (
            <div
              className="menu-item"
              onClick={() => navigate('/results')}
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '2px solid gold'
              }}
            >
              <FaMedal className="menu-icon" style={{ color: 'gold' }} />
              <h3>Resultados</h3>
              <p>Ver el campeón</p>
            </div>
          )}
        </div>

        {/* Tournament info card */}
        {tournament && (
          <div className="card mt-3">
            <h3 className="mb-2">
              Torneo Actual
              <button
                onClick={() => navigate('/tournaments')}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--brand-color)',
                  cursor: 'pointer',
                  marginLeft: '0.5rem',
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  textDecoration: 'underline'
                }}
              >
                Cambiar
              </button>
            </h3>
            <p><strong>{tournament.name}</strong></p>
            {tournament.startDate && tournament.endDate && (
              <p className="text-muted">
                {new Date(tournament.startDate).toLocaleDateString()} -
                {new Date(tournament.endDate).toLocaleDateString()}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem'
              }}
            >
              <div>
                <p className="text-muted">Equipos</p>
                <p className="stat">{teams.length}</p>
              </div>
              <div>
                <p className="text-muted">Partidos</p>
                <p className="stat">{matches.length}</p>
              </div>
              <div>
                <p className="text-muted">Estado</p>
                <p
                  className="stat"
                  style={{
                    color: tournament.grandFinalPlayed ? 'var(--success-color)' : 'var(--brand-color)'
                  }}
                >
                  {tournament.grandFinalPlayed ? 'Completado' : 'En curso'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
};

export default HomePage;