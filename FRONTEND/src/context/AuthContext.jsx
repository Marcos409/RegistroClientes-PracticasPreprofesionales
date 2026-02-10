// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { login as apiLogin, logout as apiLogout } from '../services/auth.service'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode(storedToken)

        // ⏰ verificar expiración
        if (decoded.exp * 1000 < Date.now()) {
          logout()
        } else {
          setUser(JSON.parse(storedUser)) // Usar el usuario completo del localStorage
          setToken(storedToken)
        }
      } catch (error) {
        console.error('Token inválido:', error)
        logout()
      }
    }

    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      // Llamar al servicio de autenticación
      const userData = await apiLogin(username, password)
      
      // El servicio ya guarda en localStorage
      const storedToken = localStorage.getItem('token')
      
      if (storedToken) {
        const decoded = jwtDecode(storedToken)
        setToken(storedToken)
        setUser(userData) // Usar los datos completos del usuario
        return userData
      } else {
        throw new Error('No se recibió token del servidor')
      }
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)