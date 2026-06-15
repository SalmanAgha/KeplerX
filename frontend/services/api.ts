const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('saas_token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 || (response.status === 404 && data.message === 'User not found')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('saas_token');
        localStorage.removeItem('saas_user');
        window.location.href = '/login';
      }
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const apiCall = request;

export const authService = {
  login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (userData: any) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

export const userService = {
  getProfile: () => request('/users/profile'),
  getAllUsers: () => request('/users/all'),
  createUser: (data: any) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: string) => request(`/users/${id}`, { method: 'DELETE' }),
};

export const subscriptionService = {
  update: (data: any) => request('/subscriptions/update', { method: 'POST', body: JSON.stringify(data) }),
};

export const departmentService = {
  getDepartments: () => request('/teams'),
  createDepartment: (data: any) => request('/teams', { method: 'POST', body: JSON.stringify(data) }),
  addMember: (deptId: string, data: any) => request(`/teams/${deptId}/members`, { method: 'POST', body: JSON.stringify(data) }),
  removeMember: (deptId: string, userId: string) => request(`/teams/${deptId}/members/${userId}`, { method: 'DELETE' }),
};

export const roleService = {
  getRoles: () => request('/roles'),
  createRole: (data: any) => request('/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRole: (id: string, data: any) => request(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRole: (id: string) => request(`/roles/${id}`, { method: 'DELETE' }),
};

export const notificationService = {
  getNotifications: () => request('/notifications'),
  markAsRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () => request('/notifications/read-all', { method: 'PUT' }),
  delete: (id: string) => request(`/notifications/${id}`, { method: 'DELETE' }),
};

export const systemService = {
  getJobs: (type: string) => request(`/system/jobs?type=${type}`),
  getSmtpConfig: () => request('/system/smtp'),
  updateSmtpConfig: (data: any) => request('/system/smtp', { method: 'POST', body: JSON.stringify(data) }),
};

export const vpsProductService = {
  getProducts: () => request('/vps/products'),
  createProduct: (data: any) => request('/vps/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => request(`/vps/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request(`/vps/products/${id}`, { method: 'DELETE' }),
};

export const vpsSaleService = {
  getSales: () => request('/vps/sales'),
  createSale: (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('saas_token') : null;
    return fetch(`${API_URL}/vps/sales`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    }).then(r => r.json());
  },
  updateSale: (id: string, formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('saas_token') : null;
    return fetch(`${API_URL}/vps/sales/${id}`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    }).then(r => r.json());
  },
  deleteSale: (id: string) => request(`/vps/sales/${id}`, { method: 'DELETE' }),
  removeInvoice: (id: string) => request(`/vps/sales/${id}/invoice-file`, { method: 'DELETE' }),
  getInvoiceUrl: (id: string) => `${API_URL}/vps/sales/${id}/invoice-file`,
};

export const vpsPurchaseService = {
  getPurchases: () => request('/vps/purchases'),
  createPurchase: (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('saas_token') : null;
    return fetch(`${API_URL}/vps/purchases`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    }).then(r => r.json());
  },
  updatePurchase: (id: string, formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('saas_token') : null;
    return fetch(`${API_URL}/vps/purchases/${id}`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    }).then(r => r.json());
  },
  deletePurchase: (id: string) => request(`/vps/purchases/${id}`, { method: 'DELETE' }),
  removeBill: (id: string) => request(`/vps/purchases/${id}/bill`, { method: 'DELETE' }),
  getBillUrl: (id: string) => `${API_URL}/vps/purchases/${id}/bill`,
};

export const vpsSettingsService = {
  getSettings: () => request('/vps/settings'),
  updateSettings: (data: any) => request('/vps/settings', { method: 'POST', body: JSON.stringify(data) }),
};

export const taskService = {
  getTasks: () => request('/tasks'),
  createTask: (data: any) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: any) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

export const cronService = {
  getLogs: () => request('/cron'),
  triggerCron: () => request('/cron/trigger', { method: 'POST' }),
};
