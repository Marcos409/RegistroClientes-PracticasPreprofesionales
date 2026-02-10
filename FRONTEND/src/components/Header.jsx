import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Header = ({ onMenuClick, sidebarCollapsed }) => {
  const { user, logout } = useAuth()
  const [currentTime, setCurrentTime] = useState('')

  // Actualizar la hora
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout()
    }
  }

  return (
    <header className="app-header">
      {/* Botón de menú hamburguesa */}
      <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Título central */}
      <div className="header-title">
        <h1>Avícola Huancayo</h1>
        <p>Plataforma de Gestión</p>
      </div>

      {/* Información de usuario y hora */}
      <div className="header-right">
        <div className="time-display">
          <span>🕒 {currentTime}</span>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{user?.rol}</span>
          </div>
        </div>
        
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 70px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          color: #64748b;
          transition: background 0.2s ease;
        }
        
        .menu-toggle:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .header-title {
          flex: 1;
          text-align: center;
        }
        
        .header-title h1 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        
        .header-title p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .time-display {
          background: #f1f5f9;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          color: #334155;
          font-size: 0.875rem;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3a86ff, #6c63ff);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
        }
        
        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .user-role {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: capitalize;
        }
        
        .logout-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .logout-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
          color: #dc2626;
        }
        
        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }
          
          .app-header {
            padding: 0 1rem;
            height: 60px;
          }
          
          .header-title h1 {
            font-size: 1.1rem;
          }
          
          .header-title p {
            display: none;
          }
          
          .time-display {
            display: none;
          }
          
          .user-details {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}

export default Header