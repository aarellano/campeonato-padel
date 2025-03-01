import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaFutbol, FaTrophy, FaChartBar } from 'react-icons/fa';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const location = useLocation();

  const navItems = [
    { icon: FaHome, path: '/', label: 'Inicio' },
    { icon: FaUsers, path: '/teams', label: 'Equipos' },
    { icon: FaFutbol, path: '/matches', label: 'Partidos' },
    { icon: FaChartBar, path: '/rankings', label: 'Ranking' },
    { icon: FaTrophy, path: '/results', label: 'Resultados' },
  ];

  return (
    <div className="app-container">
      {title && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--brand-color)',
            color: 'white',
            textAlign: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            boxShadow: '0 2px 4px var(--shadow-color)'
          }}
        >
          <h1>{title}</h1>
        </div>
      )}

      <div className="container">
        {children}
      </div>

      {/* Mobile navigation bar */}
      <div className="mobile-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MainLayout;