import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useState, useEffect } from 'react'

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="admin-layout">
      {/* Sidebar - Solo visible en desktop cuando no está colapsado */}
      {(!sidebarCollapsed || !isMobile) && (
        <div className="sidebar-container">
          <Sidebar />
        </div>
      )}

      {/* Overlay para móvil cuando sidebar está abierto */}
      {!sidebarCollapsed && isMobile && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Contenido principal */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <Header 
          onMenuClick={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          position: relative;
        }
        
        .sidebar-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }
        
        .page-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background-color: #f8fafc;
        }
        
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }
        
        /* Desktop styles */
        @media (min-width: 769px) {
          .sidebar-container {
            width: 250px;
            transform: translateX(0);
          }
          
          .sidebar-expanded {
            margin-left: 250px;
            width: calc(100% - 250px);
          }
          
          .sidebar-collapsed {
            margin-left: 0;
            width: 100%;
          }
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .sidebar-container {
            width: 280px;
            transform: ${sidebarCollapsed ? 'translateX(-280px)' : 'translateX(0)'};
          }
          
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
          
          .page-content {
            padding: 1.5rem;
          }
        }
        
        /* Animaciones */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .page-content {
          animation: slideIn 0.3s ease;
        }
        
        /* Estilos responsivos adicionales */
        @media (max-width: 480px) {
          .page-content {
            padding: 1rem;
          }
        }
        
        @media (min-width: 1200px) {
          .page-content {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminLayout