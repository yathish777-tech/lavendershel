import React, { createContext, useContext, useState } from 'react';
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
    total: 58.50,
    status: "Shipped",
    trackingNumber: "LV-77382-US",
    items: [
      { name: "Mindful Mornings Guided Journal", quantity: 1, price: 28.00 },
      { name: "Holographic Affirmation Sticker Vault", quantity: 1, price: 16.50 },
      { name: "Pastel Petal Gel Pen Bouquet", quantity: 1, price: 14.00 }
    ]
  },
  {
    id: "LS-948212",
    customerName: "Hannah Abbott",
    email: "hannah.a@example.com",
    date: "2026-09-29",
    itemsCount: 1,
    total: 18.00,
    status: "Processing",
    trackingNumber: "Pending",
    items: [
      { name: "The Monthly Snail Mail Club Subscription", quantity: 1, price: 18.00 }
    ]
  },
  {
    id: "LS-948213",
    customerName: "Sophie Martin",
    email: "sophie.m@example.com",
    date: "2026-09-30",
    itemsCount: 2,
    total: 89.00,
    status: "Delivered",
    trackingNumber: "LV-90412-FR",
    items: [
      { name: "The Ultimate Self-Love Sanctuary Gift Box", quantity: 1, price: 89.00 }
    ]
  }
];

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [toastMessage, setToastMessage] = useState(null);

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
      images: [],
      variants: productData.variants?.length ? productData.variants : [{ id: 'var-1', name: 'Default', color: '#B9A7E8' }],
      tags: productData.tags || ['New'],
      badges: productData.badges || ['New Arrival'],
      stock: Number(productData.stock) || 20,
      isFeatured: !!productData.isFeatured,
      isActive: productData.isActive !== false,
      contentsSummary: productData.contentsSummary || [],
      ...productData
    };

    await api.createProduct(newProduct);
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to catalogue! ✨`);
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    await api.updateProduct(id, updates);
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast("Product updated successfully! ✿");
  };

  const deleteProduct = async (id) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Product removed from catalogue");
  };

  const toggleProductActive = (id) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  };

  const toggleProductFeatured = (id) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p)));
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

    await api.createCategory(newCat);
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created! ✿`);
    return newCat;
  };

  const updateCategory = async (id, updates) => {
    await api.updateCategory(id, updates);
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    showToast("Category updated! ✿");
  };

  const deleteCategory = async (id) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast("Category deleted");
  };

  const toggleCategoryActive = (id) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  const reorderCategories = (newOrder) => {
    setCategories(newOrder);
    showToast("Categories reordered! ✨");
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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
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
