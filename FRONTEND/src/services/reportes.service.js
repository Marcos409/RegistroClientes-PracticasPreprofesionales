// frontend/src/services/reportes.service.js
import api from './api';

class ReportesService {
  
  // Obtener todos los reportes
  async getTodosLosReportes() {
    try {
      const response = await api.get('/reportes/todos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      throw error;
    }
  }

  // Reportes específicos
  async getClientesPorZona() {
    try {
      const response = await api.get('/reportes/clientes-por-zona');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes por zona:', error);
      throw error;
    }
  }

  async getClientesPorTipo() {
    try {
      const response = await api.get('/reportes/clientes-por-tipo');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes por tipo:', error);
      throw error;
    }
  }

  async getPreferencias() {
    try {
      const response = await api.get('/reportes/preferencias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      throw error;
    }
  }

  async getEvolucionMensual(meses = 12) {
    try {
      const response = await api.get(`/reportes/evolucion-mensual?meses=${meses}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener evolución mensual:', error);
      throw error;
    }
  }

  async getTopClientes(limite = 10) {
    try {
      const response = await api.get(`/reportes/top-clientes?limite=${limite}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener top clientes:', error);
      throw error;
    }
  }
}

export default new ReportesService();