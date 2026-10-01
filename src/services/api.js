/**
 * Lavendershell Frontend API Service Layer
 * 
 * Placeholder client service with async functions for backend and AI integration.
 * In this frontend-only build, all calls resolve gracefully or return mock data,
 * ready to plug into real REST/GraphQL or AI endpoints later.
 */

import initialCategories from '../data/categories.json';
import initialProducts from '../data/products.json';

export const api = {
  // Products
  async getProducts() {
    // Ready for GET /api/products
    return Promise.resolve([...initialProducts]);
  },

  async getProductById(id) {
    // Ready for GET /api/products/:id
    const found = initialProducts.find(p => p.id === id || p.slug === id);
    return Promise.resolve(found || null);
  },

  async createProduct(productData) {
    // Ready for POST /api/products
    return Promise.resolve({ id: `prod-${Date.now()}`, ...productData });
  },

  async updateProduct(id, updates) {
    // Ready for PUT /api/products/:id
    return Promise.resolve({ id, ...updates });
  },

  async deleteProduct(id) {
    // Ready for DELETE /api/products/:id
    return Promise.resolve({ success: true, id });
  },

  // Categories
  async getCategories() {
    // Ready for GET /api/categories
    return Promise.resolve([...initialCategories]);
  },

  async createCategory(categoryData) {
    // Ready for POST /api/categories
    return Promise.resolve({ id: `cat-${Date.now()}`, ...categoryData });
  },

  async updateCategory(id, updates) {
    // Ready for PUT /api/categories/:id
    return Promise.resolve({ id, ...updates });
  },

  async deleteCategory(id) {
    // Ready for DELETE /api/categories/:id
    return Promise.resolve({ success: true, id });
  },

  // Orders
  async getOrders() {
    // Ready for GET /api/orders
    return Promise.resolve([]);
  },

  async createOrder(orderPayload) {
    // Ready for POST /api/orders (checkout submission)
    return Promise.resolve({
      success: true,
      orderId: `LS-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      ...orderPayload
    });
  },

  // Contact & Newsletter
  async submitContactMessage(contactData) {
    // Ready for POST /api/contact
    return Promise.resolve({ success: true, message: 'Message sent with love' });
  },

  async subscribeNewsletter(email) {
    // Ready for POST /api/newsletter
    return Promise.resolve({ success: true, email });
  },

  // AI Endpoint Placeholder (For future prompt/letter generator)
  async generateAffirmationPrompt(theme) {
    // Ready for POST /api/ai/prompt
    return Promise.resolve({
      theme,
      affirmation: "Be gentle with your unfolding petals. You are arriving at peace.",
      letterExcerpt: "Dear friend, whenever the world feels loud, let this page be your sanctuary."
    });
  }
};

export default api;
