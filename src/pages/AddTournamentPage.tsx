import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../services/dataService';
import { Tournament } from '../types.ts';
import Layout from '../components/Layout';

const AddTournamentPage: React.FC = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'active' | 'completed'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, ingresa un nombre para el torneo.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new tournament
      createTournament(name);

      alert(`El torneo "${name}" ha sido creado con éxito.`);

      // Redirect to tournaments page
      navigate('/tournaments');
    } catch (error) {
      alert('Ha ocurrido un error al crear el torneo.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Crear Torneo">
      <div style={{ padding: '1rem', maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Crear Nuevo Torneo</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="label" htmlFor="tournamentName">
                Nombre del Torneo <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id="tournamentName"
                className="input"
                placeholder="Ej. Torneo de Verano 2023"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="tournamentStatus">
                Estado
              </label>
              <select
                id="tournamentStatus"
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'upcoming' | 'active' | 'completed')}
              >
                <option value="upcoming">Próximo</option>
                <option value="active">En curso</option>
                <option value="completed">Completado</option>
              </select>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button
                type="submit"
                className="button button-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear Torneo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddTournamentPage;