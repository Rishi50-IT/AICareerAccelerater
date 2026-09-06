import { auth } from '../firebase';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

async function fetchWithAuth(endpoint, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Unauthenticated user.');

  const token = await user.getIdToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  chat: (message, history) => fetchWithAuth('/api/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),
  generateCareerPlan: (payload) => fetchWithAuth('/api/career/plan', { method: 'POST', body: JSON.stringify(payload) }),
  generateProjectSpec: (payload) => fetchWithAuth('/api/project/generate', { method: 'POST', body: JSON.stringify(payload) }),
  generateInterviewPrep: (payload) => fetchWithAuth('/api/interview/prep', { method: 'POST', body: JSON.stringify(payload) })
};
