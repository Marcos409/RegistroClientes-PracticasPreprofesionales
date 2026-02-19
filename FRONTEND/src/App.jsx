import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Clientes from './pages/Clientes';  // ✅ IMPORTADO CORRECTAMENTE
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './routes/PrivateRoute';
import DashboardGerencial from './pages/DashboardGerencial';
import ReportesGerencial from './pages/ReportesGerencial';

// Aqui se pusieron los componentes temporales para las páginas que NO existen aún

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas con AdminLayout */}
        <Route element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route path="/dashboard" element={<DashboardGerencial />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/clientes" element={<Clientes />} />  {/* ✅ AHORA USA EL COMPONENTE REAL */}
          <Route path="/reportes" element={<ReportesGerencial />} />
          
          {/* Ruta por defecto después del login */}
          <Route index element={<DashboardGerencial />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <h1>404 - Página no encontrada</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App