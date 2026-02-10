import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña')
      return
    }

    setLoading(true)
    
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
      console.error('Error en login:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Fondo con imagen */}
      <div className="login-bg" />
      
      {/* Tarjeta de login */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-header">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="Logo Avícola Huancayo" 
              className="login-logo"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextElementSibling.style.display = 'flex'
              }}
            />
            <div className="logo-fallback">
              🐔
            </div>
          </div>
          <h1 className="login-title">Avícola Huancayo</h1>
          <p className="login-subtitle">Sistema de Gestión</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner-small"></span>
                INGRESANDO...
              </span>
            ) : (
              'INGRESAR'
            )}
          </button>

          <a href="#" className="login-forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </form>

        {/* Marca inferior */}
        <div className="login-footer">
          <p className="login-brand">
            © 2024 Avícola Huancayo - Todos los derechos reservados
          </p>
        </div>
      </div>

      <style jsx>{`
        /* Fondo con imagen oscurecida */
        .login-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/ch.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: -1;
        }
        
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
        }
        
        .login-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          animation: slideUp 0.5s ease;
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }
        
        .login-logo {
          width: 80px;
          height: auto;
          object-fit: contain;
        }
        
        .logo-fallback {
          width: 80px;
          height: 80px;
          display: none;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          background: linear-gradient(135deg, #FFA500, #FF8C00);
          border-radius: 50%;
          color: white;
        }
        
        .login-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }
        
        .login-subtitle {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
        }
        
        .login-form {
          margin-bottom: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #334155;
          font-size: 0.9rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #FFA500;
          box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
        }
        
        .form-input:disabled {
          background-color: #f8fafc;
          cursor: not-allowed;
        }
        
        .alert {
          padding: 0.875rem 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        
        .alert-error {
          background-color: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        
        /* Botón INGRESAR — estilo exacto */
        .btn-login {
          width: 100%;
          background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
          border: none;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          padding: 12px 0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
          position: relative;
          overflow: hidden;
          margin-top: 1rem;
        }
        
        .btn-login:hover:not(:disabled) {
          background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 140, 0, 0.4);
        }
        
        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }
        
        /* Efecto de brillo adicional */
        .btn-login::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(30deg);
          transition: all 0.5s ease;
          opacity: 0;
        }
        
        .btn-login:hover:not(:disabled)::after {
          opacity: 1;
          transform: rotate(30deg) translate(10%, 10%);
        }
        
        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        /* Texto ¿Olvidaste tu contraseña? — estilo exacto */
        .login-forgot-password {
          display: block;
          text-align: center;
          color: #888;
          text-decoration: none;
          font-size: 0.85rem;
          margin-top: 1rem;
          transition: color 0.2s ease;
        }
        
        .login-forgot-password:hover {
          color: #666;
        }
        
        .login-footer {
          margin-top: 2rem;
          text-align: center;
        }
        
        /* Clase para la marca inferior */
        .login-brand {
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.8rem;
          font-weight: 400;
          margin: 0;
          padding: 0.5rem 1rem;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          display: inline-block;
        }
        
        /* Animaciones */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Responsive */
        @media (max-width: 480px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
          
          .login-title {
            font-size: 1.5rem;
          }
          
          .form-input {
            padding: 0.75rem;
          }
        }
        
        @media (max-width: 360px) {
          .login-card {
            padding: 1.5rem;
          }
          
          .login-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Login