import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext.jsx';
import { ProductsProvider } from './context/ProductsContext.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './dashboard/Dashboard.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <ProductsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ProductsProvider>
    </AdminAuthProvider>
  );
}
