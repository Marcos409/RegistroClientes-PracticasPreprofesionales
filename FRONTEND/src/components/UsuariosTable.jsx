const UsuariosTable = ({ usuarios, onEdit, onToggle }) => {
  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="empty-table">
        <p>No hay usuarios para mostrar</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td className="cell-id">#{u.id}</td>
              <td className="cell-username">{u.username}</td>
              <td className="cell-name">{u.nombre_completo || '-'}</td>
              <td className="cell-rol">
                <span className={`badge-rol ${u.rol}`}>
                  {u.rol === 'admin' ? 'Administrador' : 
                   u.rol === 'supervisor' ? 'Supervisor' : 'Vendedor'}
                </span>
              </td>
              <td className="cell-estado">
                <span className={`estado ${u.estado ? 'activo' : 'inactivo'}`}>
                  {u.estado ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="cell-date">
                {u.created_at ? new Date(u.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : '-'}
              </td>
              <td className="cell-actions">
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => onEdit(u)}
                    title="Editar usuario"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2"/>
                      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`btn-toggle ${u.estado ? 'desactivar' : 'activar'}`}
                    onClick={() => onToggle(u.id)}
                    title={u.estado ? 'Desactivar usuario' : 'Activar usuario'}
                  >
                    {u.estado ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2"/>
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          width: 100%;
          overflow-x: auto;
          border-radius: 8px;
          background: white;
        }
        
        .usuarios-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        
        .usuarios-table thead {
          background-color: #f8f9fa;
          border-bottom: 2px solid #e9ecef;
        }
        
        .usuarios-table th {
          padding: 1rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #495057;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .usuarios-table tbody tr {
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.2s ease;
        }
        
        .usuarios-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        
        .usuarios-table td {
          padding: 1rem 1rem;
          color: #212529;
        }
        
        .cell-id {
          font-weight: 500;
          color: #6c757d;
          font-family: 'SF Mono', Monaco, monospace;
        }
        
        .cell-username {
          font-weight: 600;
          color: #212529;
        }
        
        .cell-name {
          color: #495057;
        }
        
        .badge-rol {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .badge-rol.admin {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        
        .badge-rol.supervisor {
          background-color: #f3e5f5;
          color: #7b1fa2;
        }
        
        .badge-rol.vendedor {
          background-color: #e8f5e9;
          color: #388e3c;
        }
        
        .estado {
          font-weight: 600;
          font-size: 0.85rem;
        }
        
        .estado.activo {
          color: #28a745;
        }
        
        .estado.inactivo {
          color: #dc3545;
        }
        
        .cell-date {
          color: #6c757d;
          font-size: 0.85rem;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-edit,
        .btn-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
        }
        
        .btn-edit {
          color: #6c757d;
          border: 1px solid #dee2e6;
        }
        
        .btn-edit:hover {
          background-color: #f8f9fa;
          border-color: #adb5bd;
          color: #495057;
        }
        
        .btn-toggle.desactivar {
          color: #dc3545;
          border: 1px solid #dc3545;
        }
        
        .btn-toggle.desactivar:hover {
          background-color: rgba(220, 53, 69, 0.05);
        }
        
        .btn-toggle.activar {
          color: #28a745;
          border: 1px solid #28a745;
        }
        
        .btn-toggle.activar:hover {
          background-color: rgba(40, 167, 69, 0.05);
        }
        
        .empty-table {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
          background: white;
          border-radius: 8px;
        }
        
        @media (max-width: 768px) {
          .usuarios-table {
            font-size: 0.8rem;
          }
          
          .usuarios-table th,
          .usuarios-table td {
            padding: 0.75rem 0.5rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .btn-edit,
          .btn-toggle {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  )
}

export default UsuariosTable