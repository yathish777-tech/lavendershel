import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialCategories from '../data/categories.json';
import initialProducts from '../data/products.json';
import { api } from '../services/api.js';

const ProductsContext = createContext(null);

export function normalizeProduct(p) {
  if (!p) return p;
  const name = p.name || p.title || '';
  const categoryId = p.categoryId || p.category_id || '';
  const isFeatured = p.isFeatured !== undefined ? p.isFeatured : (p.is_featured !== undefined ? p.is_featured : false);
  const isActive = p.isActive !== undefined ? p.isActive : (p.is_active !== undefined ? p.is_active : true);
  const isSubscription = p.isSubscription !== undefined ? p.isSubscription : (p.is_subscription !== undefined ? p.is_subscription : false);
  const compareAtPrice = p.compareAtPrice !== undefined ? p.compareAtPrice : p.compare_at_price;
  const subscriptionPlans = p.subscriptionPlans || p.subscription_plans || [];
  const badges = Array.isArray(p.badges) ? p.badges : (p.badge ? [p.badge] : []);
  const images = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []);

  return {
    ...p,
    name,
    title: name,
    categoryId,
    category_id: categoryId,
    isFeatured: Boolean(isFeatured),
    is_featured: Boolean(isFeatured),
    isActive: Boolean(isActive),
    is_active: Boolean(isActive),
    isSubscription: Boolean(isSubscription),
    is_subscription: Boolean(isSubscription),
    compareAtPrice: compareAtPrice != null ? Number(compareAtPrice) : null,
    compare_at_price: compareAtPrice != null ? Number(compareAtPrice) : null,
    subscriptionPlans,
    subscription_plans: subscriptionPlans,
    badges,
    badge: badges[0] || null,
    images,
    image: images[0] || null,
    stock: p.stock !== undefined ? Number(p.stock) : 0,
    price: p.price !== undefined ? Number(p.price) : 0,
    rating: p.rating !== undefined ? Number(p.rating) : 5.0,
    reviewCount: p.reviewCount !== undefined ? Number(p.reviewCount) : 0,
    variants: Array.isArray(p.variants) ? p.variants : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    illustrationType: p.illustrationType || p.illustration_type || 'envelope',
    illustration_type: p.illustrationType || p.illustration_type || 'envelope',
  };
}

const INITIAL_ORDERS = [
  {
    id: "LS-948211",
    customerName: "Aria Montgomery",
    email: "aria.m@example.com",
    date: "2026-09-28",
    itemsCount: 3,
    total: 1947.00,
    status: "Shipped",
    trackingNumber: "LV-77382-IN",
    items: [
      { name: "Mindful Mornings Guided Journal", quantity: 1, price: 999.00 },
      { name: "Holographic Affirmation Sticker Vault", quantity: 1, price: 499.00 },
      { name: "Pastel Petal Gel Pen Bouquet", quantity: 1, price: 449.00 }
    ]
  },
  {
    id: "LS-948212",
    customerName: "Hannah Abbott",
    email: "hannah.a@example.com",
    date: "2026-09-29",
    itemsCount: 1,
    total: 599.00,
    status: "Processing",
    trackingNumber: "Pending",
    items: [
      { name: "The Monthly Snail Mail Club Subscription", quantity: 1, price: 599.00 }
    ]
  },
  {
    id: "LS-948213",
    customerName: "Sophie Martin",
    email: "sophie.m@example.com",
    date: "2026-09-30",
    itemsCount: 2,
    total: 2499.00,
    status: "Delivered",
    trackingNumber: "LV-90412-IN",
    items: [
      { name: "The Ultimate Self-Love Sanctuary Gift Box", quantity: 1, price: 2499.00 }
    ]
  }
];

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => initialProducts.map(normalizeProduct));
  const [categories, setCategories] = useState(initialCategories);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  const notifyChange = () => {
    try {
      localStorage.setItem('lavender_catalogue_updated_at', Date.now().toString());
      window.dispatchEvent(new CustomEvent('lavender-catalogue-refresh'));
    } catch {
      // ignore
    }
  };

  // Sync data from backend
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cats, prods, ords] = await Promise.allSettled([
        api.getCategories(),
        api.getProducts(),
        api.getAdminOrders()
      ]);
      if (cats.status === 'fulfilled' && Array.isArray(cats.value) && cats.value.length > 0) {
        setCategories(cats.value);
      }
      if (prods.status === 'fulfilled' && prods.value) {
        const list = prods.value?.items || prods.value;
        if (Array.isArray(list) && list.length > 0) {
          setProducts(list.map(normalizeProduct));
        }
      }
      if (ords.status === 'fulfilled' && Array.isArray(ords.value) && ords.value.length > 0) {
        setOrders(ords.value);
      }
    } catch (e) {
      console.warn("Initial admin data sync note:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for storage events
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'lavender_catalogue_updated_at') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadData]);

  // Products CRUD
  const addProduct = async (productData) => {
    const payload = normalizeProduct({
      rating: 5.0,
      reviewCount: 0,
      images: productData.images || [],
      variants: productData.variants?.length ? productData.variants : [{ id: 'var-1', name: 'Default', color: '#B9A7E8' }],
      tags: productData.tags || ['New'],
      badges: productData.badges || ['New Arrival'],
      stock: Number(productData.stock) || 20,
      isFeatured: !!productData.isFeatured,
      isActive: productData.isActive !== false,
      contentsSummary: productData.contentsSummary || [],
      ...productData
    });

    try {
      const serverResult = await api.createProduct(payload);
      const created = normalizeProduct(serverResult || payload);
      setProducts(prev => [created, ...prev]);
      notifyChange();
      showToast(`Added "${created.name}" to catalogue! ✨`);
      return created;
    } catch (e) {
      showToast(`Failed to save product to database: ${e.message}`, 'error');
      throw e;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const serverResult = await api.updateProduct(id, updates);
      const updated = normalizeProduct(serverResult || { id, ...updates });
      setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
      notifyChange();
      showToast("Product updated successfully! ✿");
      return updated;
    } catch (e) {
      showToast(`Failed to update product in database: ${e.message}`, 'error');
      throw e;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      notifyChange();
      showToast("Product removed from catalogue");
    } catch (e) {
      showToast(`Failed to delete product from database: ${e.message}`, 'error');
      throw e;
    }
  };

  const toggleProductActive = async (id) => {
    const prod = products.find(p => p.id === id);
    const newActive = !prod?.isActive;
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, isActive: newActive, is_active: newActive } : p)));
    try {
      await api.toggleProductActive(id);
      notifyChange();
    } catch (e) {
      showToast(`Failed to toggle active: ${e.message}`, 'error');
    }
  };

  const toggleProductFeatured = async (id) => {
    const prod = products.find(p => p.id === id);
    const newFeatured = !prod?.isFeatured;
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, isFeatured: newFeatured, is_featured: newFeatured } : p)));
    try {
      await api.updateProduct(id, { is_featured: newFeatured });
      notifyChange();
    } catch (e) {
      showToast(`Failed to toggle featured: ${e.message}`, 'error');
    }
  };

  // Categories CRUD
  const addCategory = async (catData) => {
    const newId = `cat-${Date.now()}`;
    const slug = (catData.name || 'category')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newCat = {
      id: newId,
      slug,
      order: categories.length + 1,
      isActive: true,
      color: '#B9A7E8',
      icon: 'sparkles',
      ...catData
    };

    try {
      const serverResult = await api.createCategory(newCat);
      const created = serverResult || newCat;
      setCategories(prev => [...prev, created]);
      notifyChange();
      showToast(`Category "${created.name}" created! ✿`);
      return created;
    } catch (e) {
      showToast(`Failed to create category: ${e.message}`, 'error');
      throw e;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const serverResult = await api.updateCategory(id, updates);
      const updated = serverResult || { id, ...updates };
      setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
      notifyChange();
      showToast("Category updated! ✿");
      return updated;
    } catch (e) {
      showToast(`Failed to update category: ${e.message}`, 'error');
      throw e;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      notifyChange();
      showToast("Category deleted");
    } catch (e) {
      showToast(`Failed to delete category: ${e.message}`, 'error');
      throw e;
    }
  };

  const toggleCategoryActive = async (id) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
    try {
      await api.toggleCategoryActive(id);
      notifyChange();
    } catch (e) {
      showToast(`Failed to toggle category active: ${e.message}`, 'error');
    }
  };

  const reorderCategories = async (newOrder) => {
    setCategories(newOrder);
    try {
      await api.reorderCategories(newOrder.map((c, idx) => ({ id: c.id, sort_order: idx + 1 })));
      notifyChange();
      showToast("Categories reordered! ✨");
    } catch (e) {
      showToast(`Failed to reorder categories: ${e.message}`, 'error');
    }
  };

  // Orders
  const addOrder = (orderData) => {
    const newOrder = {
      id: `LS-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: "Processing",
      trackingNumber: `LV-${Math.floor(10000 + Math.random() * 90000)}-POST`,
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
    try {
      await api.updateAdminOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
    } catch (e) {
      showToast(`Failed to update order status: ${e.message}`, 'error');
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        orders,
        toastMessage,
        isLoading,
        showToast,
        loadData,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        toggleProductFeatured,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryActive,
        reorderCategories,
        addOrder,
        updateOrderStatus
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
