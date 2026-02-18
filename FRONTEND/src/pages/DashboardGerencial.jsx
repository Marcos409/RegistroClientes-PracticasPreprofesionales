import { useState } from 'react'
import KPICards from '../components/dashboard/KPICards'
import DistribucionTiposChart from '../components/dashboard/DistribucionTiposChart'
import MapaCalorHuancayo from '../components/dashboard/MapaCalorHuancayo'
import TendenciasMensualesChart from '../components/dashboard/TendenciasMensualesChart'
import TablaDistritos from '../components/dashboard/TablaDistritos'
import DashboardService from '../services/dashboard.service'
import './DashboardGerencial.css'

const DashboardGerencial = () => {
  const [moduloActivo, setModuloActivo] = useState('resumen')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  // Módulos disponibles
  const modulos = [
    { id: 'resumen', nombre: '📊 Resumen General', icono: '📊' },
    { id: 'kpis', nombre: '📈 KPIs Principales', icono: '📈' },
    { id: 'distribucion', nombre: '🥧 Distribución por Tipo', icono: '🥧' },
    { id: 'mapa', nombre: '🗺️ Mapa de Calor', icono: '🗺️' },
    { id: 'tendencias', nombre: '📉 Tendencias Mensuales', icono: '📉' },
    { id: 'distritos', nombre: '🏘️ Distribución por Distritos', icono: '🏘️' }
  ]

  // Cargar datos según el módulo
  const cargarModulo = async (moduloId) => {
    setModuloActivo(moduloId)
    setLoading(true)
    
    try {
      if (moduloId === 'resumen' || !data) {
        // Si es resumen o no hay datos, cargar todo
        const response = await DashboardService.getDashboardData()
        setData(response.data)
      }
      // Para otros módulos, podrías cargar solo lo necesario
    } catch (error) {
      console.error('Error al cargar módulo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-gerencial">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          📊 Panel de Control Gerencial
        </h1>
        <div className="dashboard-fecha">
          {new Date().toLocaleDateString('es-PE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Menú de módulos estilo cards */}
      <div className="modulos-grid">
        {modulos.map(modulo => (
          <button
            key={modulo.id}
            className={`modulo-card ${moduloActivo === modulo.id ? 'active' : ''}`}
            onClick={() => cargarModulo(modulo.id)}
          >
            <span className="modulo-icon">{modulo.icono}</span>
            <span className="modulo-nombre">{modulo.nombre}</span>
          </button>
        ))}
      </div>

      {/* Contenido del módulo activo */}
      <div className="modulo-contenido">
        {loading ? (
          <div className="loading-spinner">Cargando módulo...</div>
        ) : (
          <>
            {moduloActivo === 'resumen' && data && (
              <>
                <KPICards kpis={data.kpis} />
                <div className="dashboard-grid-2">
                  <div className="grid-card">
                    <h3 className="card-title">
                      <span className="card-icon">🥧</span>
                      Distribución por Tipo
                    </h3>
                    <DistribucionTiposChart data={data.distribucion_tipos} />
                  </div>
                  <div className="grid-card">
                    <h3 className="card-title">
                      <span className="card-icon">🗺️</span>
                      Mapa de Calor
                    </h3>
                    <MapaCalorHuancayo data={data.mapa_calor} />
                  </div>
                </div>
                <div className="full-width-card">
                  <h3 className="card-title">
                    <span className="card-icon">📈</span>
                    Tendencias Mensuales
                  </h3>
                  <TendenciasMensualesChart data={data.tendencias} />
                </div>
              </>
            )}

            {moduloActivo === 'kpis' && data && (
              <div className="full-width-card">
                <h3 className="card-title">📈 KPIs Principales</h3>
                <KPICards kpis={data.kpis} />
              </div>
            )}

            {moduloActivo === 'distribucion' && data && (
              <div className="full-width-card">
                <h3 className="card-title">🥧 Distribución por Tipo de Cliente</h3>
                <DistribucionTiposChart data={data.distribucion_tipos} />
              </div>
            )}

            {moduloActivo === 'mapa' && data && (
              <div className="full-width-card">
                <h3 className="card-title">🗺️ Mapa de Calor - Zonas de Huancayo</h3>
                <MapaCalorHuancayo data={data.mapa_calor} />
              </div>
            )}

            {moduloActivo === 'tendencias' && data && (
              <div className="full-width-card">
                <h3 className="card-title">📉 Tendencias Mensuales: Nuevos vs Perdidos</h3>
                <TendenciasMensualesChart data={data.tendencias} />
              </div>
            )}

            {moduloActivo === 'distritos' && data && (
              <div className="full-width-card">
                <h3 className="card-title">🏘️ Distribución por Distritos de Huancayo</h3>
                <TablaDistritos data={data.distribucion_distritos} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardGerencial