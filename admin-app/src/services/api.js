/**
 * Lavendershell Admin Studio API Service Layer
 * Interacts with the FastAPI backend (/api/admin/*).
 * Token is strictly stored in sessionStorage and attached as Bearer header.
 * Dispatches 'admin-logout' on 401 unauthenticated response.
 */

import initialCategories from '../data/categories.json';
import initialProducts from '../data/products.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getAdminToken() {
  if (typeof window !== 'undefined') {
    return window.sessionStorage.getItem('lavender_admin_token');
  }
  return null;
}

export function setAdminToken(token) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('lavender_admin_token', token);
  }
}

export function clearAdminToken() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem('lavender_admin_token');
    window.dispatchEvent(new CustomEvent('lavender-admin-logout'));
  }
}

async function safeFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAdminToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is FormData, delete Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (res.status === 401) {
      clearAdminToken();
      throw new Error("Invalid or expired session. Please log in again.");
    }

    if (!res.ok) {
      let errorMsg = `Server error ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) errorMsg = errorJson.detail;
      } catch {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

export const api = {
  // ================= Auth =================
  async login(username, password) {
    const data = await safeFetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data?.access_token) {
      setAdminToken(data.access_token);
    }
    return data;
  },

  async verifySession() {
    return await safeFetch('/api/admin/verify');
  },

  logout() {
    clearAdminToken();
  },

  // ================= Categories =================
  async getCategories() {
    try {
      const data = await safeFetch('/api/admin/categories');
      return data && data.length > 0 ? data : initialCategories;
    } catch (e) {
      console.warn("Backend categories unavailable, using local catalogue fallback:", e.message);
      return [...initialCategories];
    }
  },

  async createCategory(catData) {
    return await safeFetch('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(catData)
    });
  },

  async updateCategory(catId, updates) {
    return await safeFetch(`/api/admin/categories/${catId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteCategory(catId) {
    return await safeFetch(`/api/admin/categories/${catId}`, {
      method: 'DELETE'
    });
  },

  async toggleCategoryActive(catId) {
    return await safeFetch(`/api/admin/categories/${catId}/toggle-active`, {
      method: 'PATCH'
    });
  },

  async reorderCategories(reorderList) {
    return await safeFetch('/api/admin/categories/reorder', {
      method: 'POST',
      body: JSON.stringify(reorderList)
    });
  },

  // ================= Products =================
  async getProducts() {
    try {
      const data = await safeFetch('/api/admin/products');
      return data || initialProducts;
    } catch (e) {
      console.warn("Backend products unavailable, using local catalogue fallback:", e.message);
      return [...initialProducts];
    }
  },

  async createProduct(productData) {
    return await safeFetch('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(productId, updates) {
    return await safeFetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteProduct(productId) {
    return await safeFetch(`/api/admin/products/${productId}`, {
      method: 'DELETE'
    });
  },

  async toggleProductActive(productId) {
    return await safeFetch(`/api/admin/products/${productId}/toggle-active`, {
      method: 'PATCH'
    });
  },

  // ================= Uploads =================
  async uploadAdminImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await safeFetch('/api/admin/uploads', {
        method: 'POST',
        body: formData
      });
    } catch (e) {
      console.warn("Backend upload fallback (data URL):", e.message);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            success: true,
            file_name: file.name,
            url: reader.result
          });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  // ================= Orders =================
  async getAdminOrders() {
    return await safeFetch('/api/admin/orders');
  },

  async updateAdminOrderStatus(orderId, status) {
    return await safeFetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // ================= Dashboard =================
  async getAdminDashboardStats() {
    return await safeFetch('/api/admin/dashboard/stats');
  }
};

export default api;
