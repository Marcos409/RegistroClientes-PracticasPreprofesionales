// frontend/src/components/reportes/ReporteEvolucionMensual.jsx
import { useState } from 'react';
import BotonDescargarPDF from './BotonDescargarPDF';

const ReporteEvolucionMensual = ({ data }) => {
  const [vista, setVista] = useState('tabla'); // 'tabla' o 'grafico'

  if (!data || data.length === 0) {
    return <div className="text-center p-4">No hay datos disponibles</div>;
  }

  const columnasPDF = [
    { titulo: 'Mes', campo: 'mes_nombre' },
    { titulo: 'Nuevos Clientes', campo: 'nuevos_clientes' },
    { titulo: 'Personas Naturales', campo: 'nuevas_personas' },
    { titulo: 'Empresas', campo: 'nuevas_empresas' }
  ];

  const maxValor = Math.max(...data.map(m => m.nuevos_clientes));

  return (
    <div className="reporte-card">
      <div className="reporte-header">
        <h3 className="reporte-titulo">
          📈 Evolución Mensual de Clientes
        </h3>
        <div className="d-flex gap-2">
          <button
            className={`btn-view ${vista === 'tabla' ? 'active' : ''}`}
            onClick={() => setVista('tabla')}
          >
            📋 Tabla
          </button>
          <button
            className={`btn-view ${vista === 'grafico' ? 'active' : ''}`}
            onClick={() => setVista('grafico')}
          >
            📊 Gráfico
          </button>
          <BotonDescargarPDF
            titulo="Reporte de Evolución Mensual"
            data={data}
            columnas={columnasPDF}
            nombreArchivo="evolucion-mensual.pdf"
            tipo="tabla"
          />
        </div>
      </div>

      {vista === 'tabla' ? (
        <div className="table-responsive">
          <table className="reporte-tabla">
            <thead>
              <tr>
                <th>Mes</th>
                <th className="text-right">Nuevos Clientes</th>
                <th className="text-right">Personas Naturales</th>
                <th className="text-right">Empresas</th>
                <th className="text-right">Crecimiento</th>
              </tr>
            </thead>
            <tbody>
              {data.map((mes, index) => {
                const crecimiento = index > 0 
                  ? mes.nuevos_clientes - data[index - 1].nuevos_clientes 
                  : 0;
                return (
                  <tr key={index}>
                    <td><strong>{mes.mes_nombre}</strong></td>
                    <td className="text-right">{mes.nuevos_clientes}</td>
                    <td className="text-right">{mes.nuevas_personas}</td>
                    <td className="text-right">{mes.nuevas_empresas}</td>
                    <td className="text-right">
                      <span style={{ 
                        color: crecimiento >= 0 ? '#38b2ac' : '#ef4444',
                        fontWeight: '600'
                      }}>
                        {crecimiento > 0 ? '+' : ''}{crecimiento}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                <td>TOTAL</td>
                <td className="text-right">
                  {data.reduce((sum, m) => sum + m.nuevos_clientes, 0)}
                </td>
                <td className="text-right">
                  {data.reduce((sum, m) => sum + m.nuevas_personas, 0)}
                </td>
                <td className="text-right">
                  {data.reduce((sum, m) => sum + m.nuevas_empresas, 0)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div style={{ padding: '1rem' }}>
          {data.map((mes, index) => (
            <div key={index} className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontWeight: '600' }}>{mes.mes_nombre}</span>
                <span className="badge badge-info">{mes.nuevos_clientes} nuevos</span>
              </div>
              <div style={{ height: '40px', display: 'flex', gap: '4px' }}>
                <div style={{ 
                  width: `${(mes.nuevos_clientes / maxValor) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(135deg, #3a86ff, #6c63ff)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '10px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  {mes.nuevos_clientes}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReporteEvolucionMensual;