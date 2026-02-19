// frontend/src/pages/ReportesGerencial.jsx
import { useState, useEffect } from 'react';
import reportesService from '../services/reportes.service';
import ReporteClientesPorZona from '../components/reportes/ReporteClientesPorZona';
import ReporteClientesPorTipo from '../components/reportes/ReporteClientesPorTipo';
import ReportePreferencias from '../components/reportes/ReportePreferencias';
import ReporteEvolucionMensual from '../components/reportes/ReporteEvolucionMensual';
import ReporteTopClientes from '../components/reportes/ReporteTopClientes';
import ReporteResumen from '../components/reportes/ReporteResumen';
import './ReportesGerencial.css';

const ReportesGerencial = () => {
  const [moduloActivo, setModuloActivo] = useState('resumen');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Módulos disponibles
  const modulos = [
    { id: 'resumen', nombre: '📊 Resumen General', icono: '📊' },
    { id: 'zonas', nombre: '📍 Clientes por Zona', icono: '📍' },
    { id: 'tipos', nombre: '👥 Clientes por Tipo', icono: '👥' },
    { id: 'preferencias', nombre: '🥚 Preferencias', icono: '🥚' },
    { id: 'evolucion', nombre: '📈 Evolución Mensual', icono: '📈' },
    { id: 'top', nombre: '🏆 Top Clientes', icono: '🏆' }
  ];

  // Cargar datos
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      if (moduloActivo === 'resumen' || !data) {
        const response = await reportesService.getTodosLosReportes();
        setData(response.data);
      } else {
        // Cargar solo el módulo específico
        let response;
        switch(moduloActivo) {
          case 'zonas':
            response = await reportesService.getClientesPorZona();
            break;
          case 'tipos':
            response = await reportesService.getClientesPorTipo();
            break;
          case 'preferencias':
            response = await reportesService.getPreferencias();
            break;
          case 'evolucion':
            response = await reportesService.getEvolucionMensual();
            break;
          case 'top':
            response = await reportesService.getTopClientes();
            break;
          default:
            response = await reportesService.getTodosLosReportes();
        }
        setData(prev => ({ ...prev, [moduloActivo]: response.data }));
      }
    } catch (err) {
      setError('Error al cargar los reportes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [moduloActivo]);

  return (
    <div className="reportes-gerencial">
      {/* Header */}
      <div className="reportes-header">
        <h1 className="reportes-title">
          📋 Módulo de Reportes Gerenciales
        </h1>
        <div className="reportes-fecha">
          {new Date().toLocaleDateString('es-PE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Menú de módulos */}
      <div className="modulos-grid">
        {modulos.map(modulo => (
          <button
            key={modulo.id}
            className={`modulo-card ${moduloActivo === modulo.id ? 'active' : ''}`}
            onClick={() => setModuloActivo(modulo.id)}
          >
            <span className="modulo-icon">{modulo.icono}</span>
            <span className="modulo-nombre">{modulo.nombre}</span>
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="modulo-contenido">
        {loading ? (
          <div className="loading-spinner">Cargando reportes...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {moduloActivo === 'resumen' && data && (
              <ReporteResumen data={data} />
            )}
            {moduloActivo === 'zonas' && data?.clientes_por_zona && (
              <ReporteClientesPorZona data={data.clientes_por_zona} />
            )}
            {moduloActivo === 'tipos' && data?.clientes_por_tipo && (
              <ReporteClientesPorTipo data={data.clientes_por_tipo} />
            )}
            {moduloActivo === 'preferencias' && data?.preferencias && (
              <ReportePreferencias data={data.preferencias} />
            )}
            {moduloActivo === 'evolucion' && data?.evolucion_mensual && (
              <ReporteEvolucionMensual data={data.evolucion_mensual} />
            )}
            {moduloActivo === 'top' && data?.top_clientes && (
              <ReporteTopClientes data={data.top_clientes} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportesGerencial;