import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaUsers, FaFutbol } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { getCurrentTournament } from '../services/dataService';
import { Tournament } from '../types';

const HomePage: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | undefined>(undefined);

  useEffect(() => {
    const currentTournament = getCurrentTournament();
    setTournament(currentTournament);
  }, []);

  return (
    <MainLayout>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {/* Logo/Header */}
        <div className="mb-3">
          <img
            src="https://img.icons8.com/color/96/000000/tennis-racket.png"
            alt="Paddle Racket"
            style={{ margin: '0 auto', width: '96px', height: '96px' }}
          />
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'var(--brand-color-dark)',
              marginTop: '0.5rem'
            }}
          >
            Torneo de Padel
          </h1>
          <p
            style={{
              fontStyle: 'italic',
              fontSize: '1.2rem'
            }}
          >
            ¡El torneo más divertido!
          </p>
        </div>

        {/* Status Section */}
        <div className="card fun-border mb-3">
          <h2 className="mb-2">
            {tournament
              ? `Torneo Actual: ${tournament.name}`
              : '¡No hay torneo activo!'
            }
          </h2>

          <p className="mb-2">
            {tournament
              ? `Participan ${tournament.teams.length} equipos`
              : 'Crea un nuevo torneo para comenzar'
            }
          </p>

          {tournament && (
            <p
              className={tournament.completed ? "status-completed" : "status-in-progress"}
              style={{ fontWeight: 'bold' }}
            >
              Estado: {tournament.completed ? "Finalizado" : "En curso"}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-3">
          <h2 className="mb-2">¿Qué quieres hacer?</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              to="/teams"
              className="button button-primary w-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <FaUsers /> Ver Equipos
            </Link>

            <Link
              to="/matches"
              className="button button-secondary w-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <FaFutbol /> Ver Partidos
            </Link>

            <Link
              to="/rankings"
              className="button w-full"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: 'purple',
                color: 'white'
              }}
            >
              <FaTrophy /> Ver Ranking
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: '0.9rem', color: '#777', marginTop: '2rem' }}>
          ¡Que gane el mejor equipo! 🏆
        </p>
      </div>
    </MainLayout>
  );
};

export default HomePage;