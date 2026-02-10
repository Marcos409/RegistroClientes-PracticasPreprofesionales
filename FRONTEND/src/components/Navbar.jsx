// Navbar.jsx
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
      <span className="text-muted">
        Rol: <strong className="text-dark">{user?.rol}</strong>
      </span>

      <button
        type="button"
        className="btn"
        onClick={logout}
        style={{
          backgroundColor: '#FFA500',
          borderColor: '#FFA500',
          color: 'white',
          fontWeight: '500',
          padding: '6px 16px',
          fontSize: '0.9rem'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default Navbar