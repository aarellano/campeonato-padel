import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  Text,
  Badge,
  Stack,
  Flex,
  useDisclosure
} from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/table';
import { useToast } from '@chakra-ui/toast';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { getTournaments, deleteTournament, getCurrentTournament, setCurrentTournament } from '../services/dataService';
import { Tournament } from '../types.ts';
import Layout from '../components/Layout';

const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournamentState] = useState<Tournament | undefined>(undefined);
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load tournaments and current tournament
    const loadTournaments = () => {
      const allTournaments = getTournaments();
      setTournaments(allTournaments);
      setCurrentTournamentState(getCurrentTournament());
    };

    loadTournaments();
  }, []);

  const handleCreateTournament = () => {
    navigate('/tournaments/add');
  };

  const handleSelectTournament = (tournamentId: string) => {
    setCurrentTournament(tournamentId);
    setCurrentTournamentState(tournaments.find(t => t.id === tournamentId));

    // Toast message
    alert('Torneo seleccionado como actual');
  };

  const confirmDelete = (tournamentId: string) => {
    setTournamentToDelete(tournamentId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTournament = () => {
    if (tournamentToDelete) {
      deleteTournament(tournamentToDelete);

      // Refresh the tournaments list
      setTournaments(tournaments.filter(t => t.id !== tournamentToDelete));

      // If we deleted the current tournament, update the current tournament state
      if (currentTournament?.id === tournamentToDelete) {
        setCurrentTournamentState(getCurrentTournament());
      }

      // Toast message
      alert('Torneo eliminado con éxito');
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = (tournament: Tournament) => {
    if (tournament.completed || tournament.status === 'completed') {
      return <span className="status-completed">Completado</span>;
    } else if (tournament.status === 'upcoming') {
      return <span className="status-pending">Próximo</span>;
    } else {
      return <span className="status-in-progress">En curso</span>;
    }
  };

  return (
    <Layout title="Torneos">
      <Box p={4}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Heading size="lg">Torneos</Heading>
          <Button colorScheme="teal" onClick={handleCreateTournament}>
            Crear Nuevo Torneo
          </Button>
        </div>

        {tournaments.length === 0 ? (
          <Text>No hay torneos registrados. Crea uno nuevo para comenzar.</Text>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha de Creación</th>
                  <th>Estado</th>
                  <th>Equipos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tournament) => (
                  <tr
                    key={tournament.id}
                    style={{
                      backgroundColor: currentTournament?.id === tournament.id ? 'var(--brand-color-light)' : undefined
                    }}
                  >
                    <td style={{ fontWeight: currentTournament?.id === tournament.id ? 'bold' : 'normal' }}>
                      {tournament.name}
                      {currentTournament?.id === tournament.id && (
                        <span style={{
                          backgroundColor: 'var(--brand-color)',
                          color: 'white',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          marginLeft: '0.5rem'
                        }}>Actual</span>
                      )}
                    </td>
                    <td>{new Date(tournament.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(tournament)}</td>
                    <td>{tournament.teams.length}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {currentTournament?.id !== tournament.id && (
                          <button
                            onClick={() => handleSelectTournament(tournament.id)}
                            className="button button-primary"
                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                          >
                            Seleccionar
                          </button>
                        )}
                        <button
                          onClick={() => confirmDelete(tournament.id)}
                          className="button button-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Box>

      {/* Delete Confirmation Dialog - simple modal implementation */}
      {isDeleteDialogOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            maxWidth: '90%',
            width: '400px'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Eliminar Torneo</h3>

            <p style={{ marginBottom: '1.5rem' }}>
              ¿Estás seguro? Esta acción eliminará todos los equipos y partidos asociados al torneo.
              Esta acción no se puede deshacer.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="button button-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTournament}
                className="button button-primary"
                style={{ backgroundColor: 'var(--danger-color)' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TournamentsPage;