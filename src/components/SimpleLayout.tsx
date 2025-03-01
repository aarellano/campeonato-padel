import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaFutbol, FaTrophy, FaChartBar, FaCalendarAlt } from 'react-icons/fa';

interface SimpleLayoutProps {
  children: ReactNode;
  title?: string;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children, title }) => {
  const location = useLocation();

  const navItems = [
    { icon: FaHome, path: '/', label: 'Inicio' },
    { icon: FaCalendarAlt, path: '/tournaments', label: 'Torneos' },
    { icon: FaUsers, path: '/teams', label: 'Equipos' },
    { icon: FaFutbol, path: '/matches', label: 'Partidos' },
    { icon: FaChartBar, path: '/rankings', label: 'Ranking' },
    { icon: FaTrophy, path: '/results', label: 'Resultados' },
  ];

  // We'll show only 5 items in the mobile nav to keep it clean
  // For mobile, we'll prioritize: Home, Teams, Matches, Rankings, Results
  const mobileNavItems = navItems.filter((item, index) =>
    index !== 1 // Skip Tournaments in mobile nav
  );

  return (
    <div style={{
      minHeight: '100vh',
      paddingBottom: '70px',
      position: 'relative',
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-color)'
    }}>
      {title && (
        <div
          style={{
            padding: '1.2rem',
            backgroundColor: 'var(--brand-color)',
            color: 'white',
            textAlign: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            borderBottom: '2px solid var(--brand-color-dark)'
          }}
        >
          <h1 style={{
            margin: 0,
            fontSize: '1.8rem',
            fontFamily: 'Space Mono, monospace',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            {title}
          </h1>
        </div>
      )}

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        {children}
      </div>

      {/* Mobile navigation bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--brand-color)',
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          borderTop: '2px solid var(--brand-color-dark)'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '0.8rem 0'
        }}>
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  padding: '0.5rem',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s',
                  opacity: isActive ? 1 : 0.7
                }}
              >
                <item.icon
                  size={24}
                />
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: isActive ? 'bold' : 'normal',
                    marginTop: '0.3rem'
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimpleLayout;