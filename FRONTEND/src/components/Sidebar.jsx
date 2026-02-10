import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  // Solo mostrar sidebar si el usuario está autenticado
  if (!user) return null

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">📊</span>
          <h3 className="sidebar-title">Panel de Control</h3>
        </div>
        <div className="sidebar-user-info">
          <span className="user-role-badge">{user?.rol}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          <li>
            <Link
              to="/dashboard"
              className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">📈</span>
              <span className="sidebar-text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/usuarios"
              className={`sidebar-link ${location.pathname === '/dashboard/usuarios' || location.pathname === '/usuarios' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">👥</span>
              <span className="sidebar-text">Usuarios</span>
            </Link>
          </li>
          <li>
            <Link
              to="/clientes"
              className={`sidebar-link ${location.pathname === '/dashboard/clientes' || location.pathname === '/clientes' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">👨‍💼</span>
              <span className="sidebar-text">Clientes</span>
            </Link>
          </li>
          <li>
            <Link
              to="/reportes"
              className={`sidebar-link ${location.pathname === '/dashboard/reportes' || location.pathname === '/reportes' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-text">Reportes</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Versión móvil del sidebar (hamburger menu) */}
      <div className="sidebar-mobile-toggle">
        <button className="menu-toggle-btn">
          <span className="menu-icon">☰</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 250px;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          color: #fff;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .sidebar-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
        }
        
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .sidebar-logo-icon {
          font-size: 1.75rem;
        }
        
        .sidebar-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          color: #f8fafc;
          letter-spacing: 0.5px;
        }
        
        .sidebar-user-info {
          display: flex;
          justify-content: center;
        }
        
        .user-role-badge {
          background: rgba(255, 165, 0, 0.15);
          color: #FFA500;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0 0.5rem;
        }
        
        .sidebar-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sidebar-list li {
          margin-bottom: 0.25rem;
        }
        
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          color: #cbd5e1;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          margin: 0 0.5rem;
        }
        
        .sidebar-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
        }
        
        .sidebar-link.active {
          color: white;
          background: rgba(255, 165, 0, 0.15);
          border-left: 3px solid #FFA500;
        }
        
        .sidebar-icon {
          font-size: 1.1rem;
          width: 24px;
          text-align: center;
        }
        
        .sidebar-text {
          font-size: 0.95rem;
          font-weight: 500;
        }
        
        .sidebar-mobile-toggle {
          display: none;
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .menu-toggle-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s ease;
        }
        
        .menu-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            width: 220px;
          }
        }
        
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            width: 280px;
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .sidebar-mobile-toggle {
            display: block;
          }
        }
        
        /* Animación para el sidebar móvil */
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  )
}

export default Sidebar