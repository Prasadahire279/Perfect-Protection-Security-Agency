/**
 * PERFECT PROTECTION SECURITY AGENCY - API BRIDGE
 * Replaces LocalStorage with real Spring Boot REST API calls.
 * All frontend JS files should use PPSA_API instead of PPSAEngine for data.
 */

const API_BASE = 'http://localhost:8080/api';

// ─── Token Management ────────────────────────────────────────────────────────
const TokenService = {
  get: () => localStorage.getItem('ppsa_jwt'),
  set: (token) => localStorage.setItem('ppsa_jwt', token),
  clear: () => localStorage.removeItem('ppsa_jwt'),
  getUser: () => {
    const u = localStorage.getItem('ppsa_user');
    return u ? JSON.parse(u) : null;
  },
  setUser: (user) => localStorage.setItem('ppsa_user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('ppsa_user'),
  isAdmin: () => {
    const u = TokenService.getUser();
    return u && u.roles && u.roles.includes('ROLE_ADMIN');
  }
};

// ─── HTTP Client ─────────────────────────────────────────────────────────────
async function apiRequest(method, path, body = null, requireAuth = false) {
  const headers = { 'Content-Type': 'application/json' };

  const token = TokenService.get();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}${path}`, options);

    if (res.status === 401 && requireAuth) {
      TokenService.clear();
      TokenService.clearUser();
      window.location.href = '/login.html';
      return null;
    }

    const json = await res.json();
    return { ok: res.ok, status: res.status, data: json };
  } catch (err) {
    console.error('API Error:', err);
    return { ok: false, status: 0, data: { success: false, message: 'Network error. Is the backend running?' } };
  }
}

// ─── PPSA API Object ─────────────────────────────────────────────────────────
const PPSA_API = {

  // AUTH
  auth: {
    async login(username, password) {
      const res = await apiRequest('POST', '/auth/login', { username, password });
      if (res.ok && res.data.token) {
        TokenService.set(res.data.token);
        TokenService.setUser(res.data);
      }
      return res;
    },

    async register(data) {
      return await apiRequest('POST', '/auth/register', data);
    },

    logout() {
      TokenService.clear();
      TokenService.clearUser();
      window.location.href = '/login.html';
    },

    isLoggedIn: () => !!TokenService.get(),
    isAdmin: () => TokenService.isAdmin(),
    getUser: () => TokenService.getUser()
  },

  // SERVICES (public)
  services: {
    async getAll(category = null) {
      const q = category && category !== 'All' ? `?category=${category}` : '';
      const res = await apiRequest('GET', `/services${q}`);
      return res.ok ? res.data.data : [];
    },

    async getById(id) {
      const res = await apiRequest('GET', `/services/${id}`);
      return res.ok ? res.data.data : null;
    },

    async create(service) {
      return await apiRequest('POST', '/services', service, true);
    },

    async update(id, service) {
      return await apiRequest('PUT', `/services/${id}`, service, true);
    },

    async delete(id) {
      return await apiRequest('DELETE', `/services/${id}`, null, true);
    }
  },

  // SERVICE REQUESTS (public submit, admin manage)
  requests: {
    async getAll(status = null) {
      const q = status ? `?status=${encodeURIComponent(status)}` : '';
      const res = await apiRequest('GET', `/service-requests${q}`, null, true);
      return res.ok ? res.data.data : [];
    },

    async getById(id) {
      const res = await apiRequest('GET', `/service-requests/${id}`);
      return res.ok ? res.data.data : null;
    },

    async submit(requestData) {
      return await apiRequest('POST', '/service-requests', requestData);
    },

    async updateStatus(id, status) {
      return await apiRequest('PATCH', `/service-requests/${id}/status`, { status }, true);
    },

    async delete(id) {
      return await apiRequest('DELETE', `/service-requests/${id}`, null, true);
    }
  },

  // ORGANIZATIONS (admin only)
  organizations: {
    async getAll(search = null, type = null) {
      let q = [];
      if (search) q.push(`search=${encodeURIComponent(search)}`);
      if (type && type !== 'All') q.push(`type=${encodeURIComponent(type)}`);
      const res = await apiRequest('GET', `/organizations${q.length ? '?' + q.join('&') : ''}`, null, true);
      return res.ok ? res.data.data : [];
    },

    async getById(id) {
      const res = await apiRequest('GET', `/organizations/${id}`, null, true);
      return res.ok ? res.data.data : null;
    },

    async create(org) {
      return await apiRequest('POST', '/organizations', org, true);
    },

    async update(id, org) {
      return await apiRequest('PUT', `/organizations/${id}`, org, true);
    },

    async toggleStatus(id) {
      return await apiRequest('PATCH', `/organizations/${id}/toggle-status`, null, true);
    },

    async delete(id) {
      return await apiRequest('DELETE', `/organizations/${id}`, null, true);
    }
  },

  // SECURITY STAFF (admin only)
  securityStaff: {
    async getAll(availableOnly = false) {
      const q = availableOnly ? '?availableOnly=true' : '';
      const res = await apiRequest('GET', `/security-staff${q}`, null, true);
      return res.ok ? res.data.data : [];
    },

    async getById(id) {
      const res = await apiRequest('GET', `/security-staff/${id}`, null, true);
      return res.ok ? res.data.data : null;
    },

    async create(staff) {
      return await apiRequest('POST', '/security-staff', staff, true);
    },

    async update(id, staff) {
      return await apiRequest('PUT', `/security-staff/${id}`, staff, true);
    },

    async delete(id) {
      return await apiRequest('DELETE', `/security-staff/${id}`, null, true);
    }
  },

  // HOUSEKEEPING STAFF (admin only)
  housekeepingStaff: {
    async getAll(availableOnly = false) {
      const q = availableOnly ? '?availableOnly=true' : '';
      const res = await apiRequest('GET', `/housekeeping-staff${q}`, null, true);
      return res.ok ? res.data.data : [];
    },

    async getById(id) {
      const res = await apiRequest('GET', `/housekeeping-staff/${id}`, null, true);
      return res.ok ? res.data.data : null;
    },

    async create(staff) {
      return await apiRequest('POST', '/housekeeping-staff', staff, true);
    },

    async update(id, staff) {
      return await apiRequest('PUT', `/housekeeping-staff/${id}`, staff, true);
    },

    async delete(id) {
      return await apiRequest('DELETE', `/housekeeping-staff/${id}`, null, true);
    }
  },

  // ASSIGNMENTS (admin only)
  assignments: {
    async getAll(orgId = null) {
      const q = orgId ? `?orgId=${orgId}` : '';
      const res = await apiRequest('GET', `/assignments${q}`, null, true);
      return res.ok ? res.data.data : [];
    },

    async assign(data) {
      return await apiRequest('POST', '/assignments', data, true);
    },

    async relieve(id) {
      return await apiRequest('PATCH', `/assignments/${id}/relieve`, null, true);
    }
  },

  // ATTENDANCE (admin only)
  attendance: {
    async getByDate(date = null, orgName = null) {
      let q = [];
      if (date) q.push(`date=${date}`);
      if (orgName) q.push(`orgName=${encodeURIComponent(orgName)}`);
      const res = await apiRequest('GET', `/attendance${q.length ? '?' + q.join('&') : ''}`, null, true);
      return res.ok ? res.data.data : [];
    },

    async log(record) {
      return await apiRequest('POST', '/attendance', record, true);
    },

    async update(id, record) {
      return await apiRequest('PUT', `/attendance/${id}`, record, true);
    },

    async getTodayStats() {
      const res = await apiRequest('GET', '/attendance/stats/today', null, true);
      return res.ok ? res.data.data : null;
    }
  },

  // ENQUIRIES (public submit, admin manage)
  enquiries: {
    async getAll(status = null) {
      const q = status ? `?status=${encodeURIComponent(status)}` : '';
      const res = await apiRequest('GET', `/enquiries${q}`, null, true);
      return res.ok ? res.data.data : [];
    },

    async submit(data) {
      return await apiRequest('POST', '/enquiries', data);
    },

    async respond(id, response) {
      return await apiRequest('PATCH', `/enquiries/${id}/respond`, { response }, true);
    },

    async updateStatus(id, status) {
      return await apiRequest('PATCH', `/enquiries/${id}/status`, { status }, true);
    }
  },

  // ADMIN DASHBOARD
  dashboard: {
    async getStats() {
      const res = await apiRequest('GET', '/admin/dashboard', null, true);
      return res.ok ? res.data.data : null;
    },

    async getRecentRequests() {
      const res = await apiRequest('GET', '/admin/recent-requests', null, true);
      return res.ok ? res.data.data : [];
    },

    async getRecentEnquiries() {
      const res = await apiRequest('GET', '/admin/recent-enquiries', null, true);
      return res.ok ? res.data.data : [];
    }
  }
};

// ─── Auth Guard: call on protected pages ─────────────────────────────────────
function requireLogin() {
  if (!PPSA_API.auth.isLoggedIn()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!requireLogin()) return false;
  if (!PPSA_API.auth.isAdmin()) {
    alert('Access denied. Admin privileges required.');
    window.location.href = '/index.html';
    return false;
  }
  return true;
}
