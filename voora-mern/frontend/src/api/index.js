import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// ENQUIRIES
export const submitEnquiry = (data) => api.post('/enquiries', data);
export const getAllEnquiries = (params) => api.get('/enquiries', { params });
export const getEnquiry = (id) => api.get(`/enquiries/${id}`);
export const updateEnquiry = (id, data) => api.put(`/enquiries/${id}`, data);
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`);
export const getEnquiryStats = () => api.get('/enquiries/stats/overview');

// PROJECTS
export const getAllProjects = (params) => api.get('/projects', { params });
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const seedProjects = () => api.post('/projects/seed/defaults');

export default api;
