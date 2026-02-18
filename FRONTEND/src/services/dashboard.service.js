import api from './api'

class DashboardService {
  
  // Cargar todo el dashboard
  async getDashboardData() {
    try {
      const response = await api.get('/dashboard/gerencial')
      return response.data
    } catch (error) {
      console.error('Error al obtener dashboard:', error)
      throw error
    }
  }

  // Cargar solo KPIs
  async getKPIs() {
    try {
      const response = await api.get('/dashboard/kpis')
      return response.data
    } catch (error) {
      console.error('Error al obtener KPIs:', error)
      throw error
    }
  }

  // Cargar solo distribución
  async getDistribucion() {
    try {
      const response = await api.get('/dashboard/distribucion-tipos')
      return response.data
    } catch (error) {
      console.error('Error al obtener distribución:', error)
      throw error
    }
  }

  // Cargar solo mapa de calor
  async getMapaCalor() {
    try {
      const response = await api.get('/dashboard/mapa-calor')
      return response.data
    } catch (error) {
      console.error('Error al obtener mapa de calor:', error)
      throw error
    }
  }

  // Cargar solo tendencias
  async getTendencias(meses = 6) {
    try {
      const response = await api.get(`/dashboard/tendencias?meses=${meses}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener tendencias:', error)
      throw error
    }
  }

  // Cargar solo distritos
  async getDistritos() {
    try {
      const response = await api.get('/dashboard/distritos')
      return response.data
    } catch (error) {
      console.error('Error al obtener distritos:', error)
      throw error
    }
  }
}

export default new DashboardService()