// frontend/src/components/reportes/ReportePreferencias.jsx
import BotonDescargarPDF from './BotonDescargarPDF';

const ReportePreferencias = ({ data }) => {
  if (!data) {
    return <div className="text-center p-4">No hay datos disponibles</div>;
  }

  const { tipo_huevo, frecuencia_compra, horario } = data;

  const colores = ['#3a86ff', '#38b2ac', '#f59e0b', '#ec4899', '#8b5cf6'];

  // Preparar datos para PDF
  const datosPDF = [
    ...tipo_huevo.map(item => ({ categoria: 'Tipo de Huevo', item: item.nombre, cantidad: item.cantidad })),
    ...frecuencia_compra.map(item => ({ categoria: 'Frecuencia', item: item.nombre, cantidad: item.cantidad })),
    ...horario.map(item => ({ categoria: 'Horario', item: item.nombre, cantidad: item.cantidad }))
  ];

  const columnasPDF = [
    { titulo: 'Categoría', campo: 'categoria' },
    { titulo: 'Preferencia', campo: 'item' },
    { titulo: 'Cantidad', campo: 'cantidad' }
  ];

  return (
    <div className="reporte-card">
      <div className="reporte-header">
        <h3 className="reporte-titulo">
          🥚 Preferencias de Clientes
        </h3>
        <BotonDescargarPDF
          titulo="Reporte de Preferencias"
          data={datosPDF}
          columnas={columnasPDF}
          nombreArchivo="preferencias-clientes.pdf"
          tipo="tabla"
        />
      </div>

      <div className="stats-grid">
        {/* Tipo de Huevo */}
        <div className="grid-card">
          <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>🥚 Tipo de Huevo</h4>
          {tipo_huevo.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>{item.nombre}</span>
                <span className="badge badge-info">{item.cantidad}</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(item.cantidad / tipo_huevo.reduce((sum, i) => sum + i.cantidad, 0)) * 100}%`,
                    backgroundColor: colores[index % colores.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Frecuencia de Compra */}
        <div className="grid-card">
          <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>📅 Frecuencia de Compra</h4>
          {frecuencia_compra.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>{item.nombre}</span>
                <span className="badge badge-info">{item.cantidad}</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(item.cantidad / frecuencia_compra.reduce((sum, i) => sum + i.cantidad, 0)) * 100}%`,
                    backgroundColor: colores[(index + 3) % colores.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Horario Preferido */}
        <div className="grid-card">
          <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>⏰ Horario Preferido</h4>
          {horario.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>{item.nombre}</span>
                <span className="badge badge-info">{item.cantidad}</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(item.cantidad / horario.reduce((sum, i) => sum + i.cantidad, 0)) * 100}%`,
                    backgroundColor: colores[(index + 6) % colores.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla resumen */}
      <div className="table-responsive mt-3">
        <table className="reporte-tabla">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Preferencia</th>
              <th className="text-right">Cantidad</th>
              <th className="text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {datosPDF.map((item, index) => {
              const totalCategoria = datosPDF
                .filter(d => d.categoria === item.categoria)
                .reduce((sum, d) => sum + d.cantidad, 0);
              const porcentaje = Math.round((item.cantidad / totalCategoria) * 100);

              return (
                <tr key={index}>
                  <td>{item.categoria}</td>
                  <td>{item.item}</td>
                  <td className="text-right">{item.cantidad}</td>
                  <td className="text-right">
                    <span className="badge badge-info">{porcentaje}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportePreferencias;