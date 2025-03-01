import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLayout from '../components/SimpleLayout';
import { createTournament } from '../services/dataService';

const AddTournamentPage = () => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        alert('Por favor ingresa un nombre para el torneo');
        setIsSubmitting(false);
        return;
      }

      const tournament = createTournament(name.trim());

      // Show success message and redirect
      alert('Torneo creado con éxito');
      navigate('/tournaments');
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Error al crear el torneo');
      setIsSubmitting(false);
    }
  };

  return (
    <SimpleLayout title="Crear Nuevo Torneo">
      <div className="card" style={{
        padding: '1.5rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--text-color)',
                fontFamily: 'Space Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem'
              }}
            >
              Nombre del Torneo
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Torneo de Verano 2023"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '2px solid var(--text-color-light)',
                backgroundColor: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="startDate"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: 'var(--text-color)',
                fontFamily: 'Space Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem'
              }}
            >
              Fecha de Inicio
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '2px solid var(--text-color-light)',
                backgroundColor: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s',
                outline: 'none'
              }}
            />
            <small style={{
              display: 'block',
              marginTop: '0.25rem',
              color: 'var(--text-color-muted)'
            }}>
              Si no se selecciona, se usará la fecha actual
            </small>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => navigate('/tournaments')}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '4px',
                border: '1px solid var(--text-color-light)',
                backgroundColor: 'var(--background-color)',
                color: 'var(--text-color)',
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'Space Mono, monospace',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'var(--brand-color)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'Space Mono, monospace',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              {isSubmitting ? 'Creando...' : 'Crear Torneo'}
            </button>
          </div>
        </form>
      </div>
    </SimpleLayout>
  );
};

export default AddTournamentPage;