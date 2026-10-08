import React, { createContext, useContext, useState, useEffect } from 'react';
import initialCategories from '../data/categories.json';
import initialProducts from '../data/products.json';
import { api } from '../services/api.js';

const ProductsContext = createContext(null);

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
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync data on mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const [cats, prods, ords] = await Promise.allSettled([
          api.getCategories(),
          api.getProducts(),
          api.getAdminOrders()
        ]);
        if (cats.status === 'fulfilled' && cats.value) setCategories(cats.value);
        if (prods.status === 'fulfilled' && prods.value) {
          const list = prods.value?.items || prods.value;
          if (Array.isArray(list) && list.length > 0) setProducts(list);
        }
        if (ords.status === 'fulfilled' && Array.isArray(ords.value) && ords.value.length > 0) {
          setOrders(ords.value);
        }
      } catch (e) {
        // use initial fallback
      }
    }
    loadInitial();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  // Products CRUD
  const addProduct = async (productData) => {
    const newId = `prod-${Date.now()}`;
    const newSlug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const newProduct = {
      id: newId,
      slug: newSlug,
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
    };

    try {
      await api.createProduct(newProduct);
    } catch (e) {
      console.warn("API createProduct note:", e.message);
    }

    setProducts(prev => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to catalogue! ✨`);
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    try {
      await api.updateProduct(id, updates);
    } catch (e) {
      console.warn("API updateProduct note:", e.message);
    }
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast("Product updated successfully! ✿");
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
    } catch (e) {
      console.warn("API deleteProduct note:", e.message);
    }
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Product removed from catalogue");
  };

  const toggleProductActive = async (id) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
    try {
      await api.toggleProductActive(id);
    } catch (e) {
      // offline fallback
    }
  };

  const toggleProductFeatured = async (id) => {
    const prod = products.find(p => p.id === id);
    const newFeatured = !prod?.isFeatured;
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, isFeatured: newFeatured } : p)));
    try {
      await api.updateProduct(id, { is_featured: newFeatured });
    } catch (e) {
      // offline fallback
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
      await api.createCategory(newCat);
    } catch (e) {
      // offline fallback
    }
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created! ✿`);
    return newCat;
  };

  const updateCategory = async (id, updates) => {
    try {
      await api.updateCategory(id, updates);
    } catch (e) {
      // offline fallback
    }
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    showToast("Category updated! ✿");
  };

  const deleteCategory = async (id) => {
    try {
      await api.deleteCategory(id);
    } catch (e) {
      // offline fallback
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast("Category deleted");
  };

  const toggleCategoryActive = async (id) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
    try {
      await api.toggleCategoryActive(id);
    } catch (e) {
      // offline fallback
    }
  };

  const reorderCategories = async (newOrder) => {
    setCategories(newOrder);
    try {
      await api.reorderCategories(newOrder.map((c, idx) => ({ id: c.id, sort_order: idx + 1 })));
    } catch (e) {
      // offline fallback
    }
    showToast("Categories reordered! ✨");
  };

  // Orders
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
    try {
      await api.updateAdminOrderStatus(orderId, newStatus);
    } catch (e) {
      // offline fallback
    }
    showToast(`Order status updated to ${newStatus}`);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        orders,
        toastMessage,
        showToast,
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
