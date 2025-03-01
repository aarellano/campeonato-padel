import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import { getMatches, getCurrentTournament, getTeamById, getMissingMatches, getTopTwoTeams } from '../services/dataService';
import { Match, Team, Tournament } from '../types';

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournament, setTournament] = useState<Tournament | undefined>(undefined);
  const [missingMatchups, setMissingMatchups] = useState<{teamA: Team, teamB: Team}[]>([]);
  const [finalists, setFinalists] = useState<[Team | undefined, Team | undefined]>([undefined, undefined]);

  useEffect(() => {
    // Get current tournament
    const currentTournament = getCurrentTournament();
    setTournament(currentTournament);

    if (currentTournament) {
      // Get matches for the tournament
      const tournamentMatches = getMatches(currentTournament.id);
      setMatches(tournamentMatches);

      // Get missing matchups
      const missing = getMissingMatches(currentTournament.id);
      setMissingMatchups(missing);

      // Get finalists
      const top2Teams = getTopTwoTeams(currentTournament.id);
      setFinalists(top2Teams);
    }
  }, []);

  const getTeamName = (teamId: string): string => {
    const team = getTeamById(teamId);
    return team ? team.name : 'Equipo desconocido';
  };

  const getMatchStatusClass = (match: Match): string => {
    return match.isGrandFinal ? 'status-completed' : 'status-in-progress';
  };

  const renderMatchResult = (match: Match) => {
    const teamAName = getTeamName(match.teamAId);
    const teamBName = getTeamName(match.teamBId);

    return (
      <div key={match.id} className="card mb-2">
        <div
          style={{
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>
            {match.isGrandFinal && (
              <span
                style={{
                  backgroundColor: 'gold',
                  color: 'black',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  marginRight: '0.5rem'
                }}
              >
                GRAN FINAL
              </span>
            )}
            Partido
          </span>
          <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>
            {new Date(match.date).toLocaleDateString()}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>{teamAName}</div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--brand-color-light)',
              borderRadius: '2rem',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}
          >
            <span>{match.teamAScore}</span>
            <span style={{ opacity: 0.5 }}>-</span>
            <span>{match.teamBScore}</span>
          </div>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>{teamBName}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <span className={getMatchStatusClass(match)}>
            {match.teamAScore > match.teamBScore ? teamAName : teamBName} ganó
          </span>
        </div>
      </div>
    );
  };

  const renderMissingMatches = () => {
    if (missingMatchups.length === 0) return null;

    return (
      <div className="mb-3">
        <h3 className="mb-2">Partidos Pendientes ({missingMatchups.length})</h3>

        {missingMatchups.map((matchup, index) => (
          <div
            key={`${matchup.teamA.id}-${matchup.teamB.id}`}
            className="card mb-2"
            style={{ backgroundColor: 'var(--background-color)' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold' }}>{matchup.teamA.name}</div>
              </div>

              <div
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px dashed var(--highlight-color)',
                  borderRadius: '2rem',
                  fontWeight: 'bold'
                }}
              >
                <FaExclamationTriangle
                  style={{ color: 'var(--highlight-color)', marginRight: '0.5rem' }}
                />
                Pendiente
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold' }}>{matchup.teamB.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGrandFinalSection = () => {
    if (!tournament) return null;

    // Check if all regular matches have been played
    const allRegularMatchesPlayed = missingMatchups.length === 0 && matches.some(m => !m.isGrandFinal);

    // Check if grand final has been played
    const grandFinalPlayed = matches.some(match => match.isGrandFinal);

    if (grandFinalPlayed) {
      const grandFinalMatch = matches.find(match => match.isGrandFinal);
      if (!grandFinalMatch) return null;

      return (
        <div className="mb-3">
          <h3 className="mb-2 text-center" style={{ color: 'var(--highlight-color)' }}>
            <FaTrophy style={{ marginRight: '0.5rem', color: 'gold' }} />
            Gran Final
          </h3>

          {renderMatchResult(grandFinalMatch)}
        </div>
      );
    }

    if (allRegularMatchesPlayed) {
      return (
        <div className="mb-3">
          <h3 className="mb-2 text-center" style={{ color: 'var(--highlight-color)' }}>
            <FaTrophy style={{ marginRight: '0.5rem', color: 'gold' }} />
            Gran Final
          </h3>

          <div className="card" style={{
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: 'var(--brand-color-light)'
          }}>
            {finalists[0] && finalists[1] ? (
              <>
                <p>
                  ¡Los finalistas están listos!
                </p>
                <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                  {finalists[0].name} vs {finalists[1].name}
                </p>
                <Link to="/grand-final" className="button button-primary" style={{ marginTop: '1rem' }}>
                  Jugar la Gran Final
                </Link>
              </>
            ) : (
              <p>
                No hay suficientes equipos para determinar a los finalistas.
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
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
              ? `${matches.filter(m => !m.isGrandFinal).length} Partidos Jugados`
              : 'No hay partidos todavía'}
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

        {tournament ? (
          <>
            {/* Grand Final Section */}
            {renderGrandFinalSection()}

            {/* Missing Matches Section */}
            {renderMissingMatches()}

            {/* Completed Matches */}
            {matches.filter(m => !m.isGrandFinal).length > 0 ? (
              <div>
                <h3 className="mb-2">Resultados</h3>
                {matches.filter(m => !m.isGrandFinal).map(match => renderMatchResult(match))}
              </div>
            ) : missingMatchups.length > 0 ? (
              <div className="card text-center" style={{ padding: '1rem' }}>
                <p>No se ha jugado ningún partido todavía.</p>
                <p>Comienza a registrar los resultados de los partidos.</p>
                <Link to="/matches/add" className="button button-primary" style={{ marginTop: '1rem' }}>
                  Registrar Resultado
                </Link>
              </div>
            ) : (
              <div className="card text-center" style={{ padding: '1rem' }}>
                <p>No hay suficientes equipos para crear partidos.</p>
                <Link to="/teams/add" className="button button-primary" style={{ marginTop: '1rem' }}>
                  Agregar Equipos
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center" style={{ padding: '1rem' }}>
            <p className="status-pending">No hay un torneo activo.</p>
            <p>Crea un torneo para comenzar a registrar partidos.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MatchesPage;