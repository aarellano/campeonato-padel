import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { loadMockData } from './services/dataService';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import AddTeamPage from './pages/AddTeamPage';
import MatchesPage from './pages/MatchesPage';
import AddMatchPage from './pages/AddMatchPage';
import RankingsPage from './pages/RankingsPage';
import GrandFinalPage from './pages/GrandFinalPage';
import ResultsPage from './pages/ResultsPage';
import TournamentsPage from './pages/TournamentsPage';
import AddTournamentPage from './pages/AddTournamentPage';

// Temporary placeholder component until we create all pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="placeholder-page">
    <h1>{title}</h1>
    <p>Esta página está en desarrollo...</p>
  </div>
);

function App() {
  // Initialize mock data on mount
  useEffect(() => {
    loadMockData();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/tournaments/add" element={<AddTournamentPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/add" element={<AddTeamPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/add" element={<AddMatchPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/grand-final" element={<GrandFinalPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
