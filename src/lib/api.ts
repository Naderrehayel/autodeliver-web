import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Token helpers ──────────────────────────────────────────────
export const getToken    = ()        => Cookies.get('ad_token') || '';
export const setToken    = (t: string) => Cookies.set('ad_token', t, { expires: 7, sameSite: 'lax' });
export const removeToken = ()        => Cookies.remove('ad_token');
export const setRefresh  = (t: string) => Cookies.set('ad_refresh', t, { expires: 30, sameSite: 'lax' });
export const getRefresh  = ()        => Cookies.get('ad_refresh') || '';

// ── Core fetch ─────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Try refresh
    const refresh = getRefresh();
    if (refresh) {
      const r = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (r.ok) {
        const data = await r.json();
        setToken(data.data.accessToken);
        // Retry original request
        return apiFetch<T>(path, options, auth);
      }
    }
    removeToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Auth ───────────────────────────────────────────────────────
export const auth = {
  register: (body: object) =>
    apiFetch<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }, false),

  login: (body: { email: string; password: string }) =>
    apiFetch<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }, false),

  logout: (refreshToken: string) =>
    apiFetch<any>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  me: () => apiFetch<any>('/auth/me'),

  forgotPassword: (email: string) =>
    apiFetch<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }, false),

  resetPassword: (body: object) =>
    apiFetch<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }, false),
};

// ── Orders ─────────────────────────────────────────────────────
export const orders = {
  list:   (params?: Record<string, string>) =>
    apiFetch<any>(`/orders?${new URLSearchParams(params)}`),

  get:    (id: string) => apiFetch<any>(`/orders/${id}`),

  create: (body: object) =>
    apiFetch<any>('/orders', { method: 'POST', body: JSON.stringify(body) }),

  cancel: (id: string, reason: string) =>
    apiFetch<any>(`/orders/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) }),

  available: (params?: Record<string, string>) =>
    apiFetch<any>(`/orders/available?${new URLSearchParams(params)}`),

  updateStatus: (id: string, body: object) =>
    apiFetch<any>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),
};

// ── Offers ─────────────────────────────────────────────────────
export const offers = {
  submit: (orderId: string, body: object) =>
    apiFetch<any>(`/orders/${orderId}/offers`, { method: 'POST', body: JSON.stringify(body) }),

  accept: (orderId: string, offerId: string) =>
    apiFetch<any>(`/orders/${orderId}/offers/${offerId}/accept`, { method: 'PUT' }),

  reject: (orderId: string, offerId: string) =>
    apiFetch<any>(`/orders/${orderId}/offers/${offerId}/reject`, { method: 'PUT' }),

  myOffers: (params?: Record<string, string>) =>
    apiFetch<any>(`/driver/offers?${new URLSearchParams(params)}`),
};

// ── Tracking ───────────────────────────────────────────────────
export const tracking = {
  current: (orderId: string) => apiFetch<any>(`/tracking/${orderId}/current`),
  history: (orderId: string) => apiFetch<any>(`/tracking/${orderId}/history`),
  post:    (orderId: string, body: object) =>
    apiFetch<any>(`/tracking/${orderId}`, { method: 'POST', body: JSON.stringify(body) }),
};

// ── Payments ───────────────────────────────────────────────────
export const payments = {
  createIntent: (orderId: string) =>
    apiFetch<any>(`/payments/${orderId}/intent`, { method: 'POST' }),
  get: (orderId: string) =>
    apiFetch<any>(`/payments/${orderId}`),
};

// ── User ───────────────────────────────────────────────────────
export const user = {
  updateProfile:      (body: object) => apiFetch<any>('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  updateDriverProfile:(body: object) => apiFetch<any>('/users/driver-profile', { method: 'PUT', body: JSON.stringify(body) }),
  setAvailability:    (is_available: boolean) => apiFetch<any>('/users/availability', { method: 'PUT', body: JSON.stringify({ is_available }) }),
  getDriver:          (id: string) => apiFetch<any>(`/users/drivers/${id}`),
  submitReview:       (body: object) => apiFetch<any>('/users/reviews', { method: 'POST', body: JSON.stringify(body) }),
  notifications:      () => apiFetch<any>('/users/notifications'),
  messages:           (orderId: string) => apiFetch<any>(`/orders/${orderId}/messages`),
  sendMessage:        (orderId: string, content: string) =>
    apiFetch<any>(`/orders/${orderId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
};

// ── Admin ──────────────────────────────────────────────────────
export const admin = {
  dashboard: () => apiFetch<any>('/admin/dashboard'),
  users:     (params?: Record<string, string>) => apiFetch<any>(`/admin/users?${new URLSearchParams(params)}`),
  userStatus:(id: string, status: string) =>
    apiFetch<any>(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  verifyDriver:(id: string) =>
    apiFetch<any>(`/admin/drivers/${id}/verify`, { method: 'PUT' }),
  orders:    (params?: Record<string, string>) => apiFetch<any>(`/admin/orders?${new URLSearchParams(params)}`),
  revenue:   (params?: Record<string, string>) => apiFetch<any>(`/admin/revenue?${new URLSearchParams(params)}`),
};
