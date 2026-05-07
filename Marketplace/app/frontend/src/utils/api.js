// Base URL for Ask AI endpoint
const BACKEND_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:6010';
export const QA_BASE_URL = `${BACKEND_BASE}/api/chat`;

export async function ask(question, convId, imageDataUrl, signal, model, purpose) {
  convId = convId ?? localStorage.getItem('conv_id') ?? undefined;

  const info = JSON.parse(localStorage.getItem('user_info')||'{}');
  const userName = info.username || info.userName || info.email || info.name || 'anonymous';
  const payload = { message: question, conversation_id: convId, user_name: userName };
  if(purpose) payload.purpose = purpose;
  if (model) payload.model = model;
  const res = await fetch(`${QA_BASE_URL}`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(convId ? { 'X-Conversation-Id': convId } : {}),
      ...(model ? { 'X-Model': model } : {}),
      ...(purpose ? { 'X-Purpose': purpose } : {}), // Add X-Purpose header
      'X-User-Name': userName,
    },
    body: JSON.stringify(payload),
  });

  // Always grab id from header or body fallback
  let returnedId = res.headers.get('X-Conversation-Id');
  if (!returnedId) {
    try {
      const clone = res.clone();
      const body  = await clone.json();
      returnedId  = body?.conv_id;
    } catch (_) {/* ignore */}
  }

  if (returnedId) {
    convId = returnedId;
    localStorage.setItem('conv_id', convId);
  }

  const data = await res.json();
  return { ...data, convId: convId };
}

// legacy export
export { ask as askAi };

export async function createConversation(userName){
  const res = await fetch(`${BACKEND_BASE}/api/conversations`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(userName?{user_name:userName}:{})
  });
  if(!res.ok) throw new Error('Failed to create conversation');
  const data = await res.json();
  return data.conv_id;
}

// -------- streaming helper ---------
export async function askStream(question, convId, { onChunk, signal } = {}) {
  const res = await fetch(QA_BASE_URL, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(convId ? { 'X-Conversation-Id': convId } : {}),
    },
    body: JSON.stringify({ message: question, conversation_id: convId }),
  });

  const newId = res.headers.get('X-Conversation-ID');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n\n')) !== -1) {
      const raw = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 2);
      if (!raw) continue;
      const line = raw.split('\n')[0];
      if (line.startsWith('data:')) {
        let payload = line.slice(5).trim();
        try{
          const json = JSON.parse(payload);
          payload = json.content || '';
        }catch{ /* not json */ }
        onChunk?.(payload);
      }
    }
  }

  return newId;
}

// Mock API wrapper. Replace with real fetch/XHR in future.
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const mockJobs = [
  { id: 1, name: 'Embedding batch 202', status: 'running', progress: 70 },
  { id: 2, name: 'Sync conversations', status: 'queued', progress: 0 },
  { id: 3, name: 'Reindex vectors', status: 'completed', progress: 100 },
];

const mockLogs = [
  { time: '2025-09-04 10:21', level: 'info', message: 'Embeddings batch started' },
  { time: '2025-09-04 10:23', level: 'warn', message: 'Slow response from vector DB' },
  { time: '2025-09-04 10:24', level: 'error', message: 'OpenAI rate limit hit' },
];

const mockNotifications=[
 {id:1,text:'New user registered',time:'2m ago'},
 {id:2,text:'Pipeline completed',time:'10m ago'},
 {id:3,text:'Server restart scheduled',time:'1h ago'},
];

const mockAdmins=[
 {id:1,name:'Alice Johnson',email:'alice@greyd.io',role:'Super Admin'},
 {id:2,name:'Bob Smith',email:'bob@greyd.io',role:'Editor'},
 {id:3,name:'Carol Lee',email:'carol@greyd.io',role:'Viewer'},
];

const mockPermissions=[
 {perm:'Manage Users', superAdmin:true, editor:false, viewer:false},
 {perm:'Edit Content', superAdmin:true, editor:true, viewer:false},
 {perm:'View Analytics', superAdmin:true, editor:true, viewer:true},
];

const API = process.env.REACT_APP_API_URL || 'http://localhost:6010';

export async function login(email, password) {
  const res = await fetch(
    `${API}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!res.ok) {
    throw await res.json();
  }
  return res.json(); // { token }
}

export async function register(data) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchAdmins(token) {
  const res = await fetch(`${API}/api/users/admins`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function deleteAdmin(id, token){
  const res = await fetch(`${API}/api/users/admins/${id}`,{
    method:'DELETE',
    headers:{ Authorization:`Bearer ${token}` }
  });
  if(!res.ok) throw await res.json();
  return res.json();
}

export async function logout() {
  const token = localStorage.getItem('jwt');
  try {
    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (_) {
    // ignore network logout errors
  }
}

export async function submitRemark(convId, rating, comment){
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API}/api/remarks`,{
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`},
    body:JSON.stringify({ conv_id:convId, rating, comment })
  });
  if(!res.ok){
    const { error } = await res.json();
    throw new Error(error || 'Failed to submit remark');
  }
  return res.json();
}

export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:6010';

const api = {
  async getJobs() {
    await delay(500); // simulate network
    return JSON.parse(JSON.stringify(mockJobs));
  },
  async getLogs() {
    try {
      const res = await fetch(`${QA_BASE_URL}/logs?limit=2000`);
      if (!res.ok) throw new Error("network");
      const grouped = await res.json(); // {reqId: [events]}

      const rows = [];
      Object.entries(grouped).forEach(([rid, events]) => {
        events.forEach((ev) => {
          const normLevel = (ev.level || '').toLowerCase() === 'warning' ? 'warn' : (ev.level || '').toLowerCase();
          rows.push({
            time: ev.ts?.replace("T", " ") || "", // iso → nicer
            level: normLevel,
            message: `${ev.msg}${ev.slow ? " ⚠️ slow" : ""}${ev.metrics ? " [metrics]" : ""}`,
            request_id: rid === "_no_request_" ? "-" : rid,
          });
        });
      });
      // newest first
      rows.sort((a, b) => (a.time < b.time ? 1 : -1));
      return rows;
    } catch (_err) {
      // fallback mock
      await delay(400);
      return JSON.parse(JSON.stringify(mockLogs));
    }
  },
  async registerAdmin(data) {
    const res = await fetch(`${BACKEND_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => 'Registration failed');
      throw new Error(msg || 'Registration failed');
    }
    return res.json();
  },
};

api.getNotifications=async ()=>{await delay(300);return JSON.parse(JSON.stringify(mockNotifications));};
api.getAdmins=async()=>{await delay(400);return JSON.parse(JSON.stringify(mockAdmins));};
api.getPermissions=async()=>{await delay(300);return JSON.parse(JSON.stringify(mockPermissions));};

export function authFetch(path, opts = {}) {
  const base = API;
  const token = localStorage.getItem('jwt');
  const headers = { ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${base}${path}`, { ...opts, headers }).then(async res => {
    if (res.status === 401) {
      // auto logout on unauthorized
      localStorage.removeItem('jwt');
      window.location.replace('/login');
      throw new Error('Unauthenticated');
    }
    return res;
  });
}

export default api;
