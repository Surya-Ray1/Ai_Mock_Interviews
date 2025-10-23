import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// auth
export const register = (data) => api.post('/auth/register', data).then(r=>r.data);
export const login    = (data) => api.post('/auth/login', data).then(r=>r.data);
export const me       = () => api.get('/auth/me').then(r=>r.data);
export const logout   = () => api.post('/auth/logout').then(r=>r.data);

// sessions
export const createSession  = (payload) => api.post('/sessions', payload).then(r=>r.data);
export const listSessions   = (params={}) => api.get('/sessions', { params }).then(r=>r.data);
export const getSession     = (id) => api.get(`/sessions/${id}`).then(r=>r.data);
export const addTranscript  = (id, payload) => api.post(`/sessions/${id}/transcripts`, payload).then(r=>r.data);
export const finishSession  = (id, payload) => api.post(`/sessions/${id}/finish`, payload).then(r=>r.data);

// AI ask
export const askAi = ({ interview_id, user_text }) =>
  api.post('/ai/ask', { interview_id, user_text }).then(r=>r.data);

export const redeemCode = (code) =>
  api.post('/access/redeem', { code }).then(r=>r.data);

// Razorpay billing
export const rzCreateOrder = () =>
  api.post('/billing/razorpay/order').then(r=>r.data);

export const rzVerify = (payload) =>
  api.post('/billing/razorpay/verify', payload).then(r=>r.data);


export default api;
