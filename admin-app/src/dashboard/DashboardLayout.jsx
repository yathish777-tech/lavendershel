import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import { Bell, Menu, X, ArrowUpRight, LogOut, User } from 'lucide-react';
import { useProducts } from '../context/ProductsContext.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import Toast from '../components/ui/Toast.jsx';

export default function DashboardLayout({
  currentTab,
  onSelectTab,
  children
}) {
  const { products, categories, orders, toastMessage, showToast } = useProducts();
  const { username, logout } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF9F4] flex flex-col">
      {/* Topbar */}
      <header className="h-16 bg-[#FFFDFB] border-b border-[#E6DEF8] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            className="md:hidden p-2 text-[#4A3B5C] hover:bg-[#F5F0FC] rounded-xl"
            aria-label="Toggle navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-[#4A3B5C]">
              Admin Studio
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E8F8F5] text-[#117A65] font-semibold border border-[#A3E4D7] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#117A65] animate-pulse" />
              <span>Active Admin Session</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="http://localhost:5713"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8F7BD1] font-semibold hover:underline"
            title="Open Storefront in new tab"
          >
            <span>Storefront (5713)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Current Admin Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF5FE] border border-[#E6DEF8] text-xs font-medium text-[#4A3B5C]">
            <User className="w-3.5 h-3.5 text-[#8F7BD1]" />
            <span className="text-[11px] font-mono">{username}</span>
          </div>

          <button
            onClick={() => showToast("All systems gentle and operational! ✿")}
            className="w-8 h-8 rounded-full bg-[#FAF5FE] text-[#8F7BD1] flex items-center justify-center hover:bg-[#E6DEF8] transition-colors"
            title="Studio notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#8A7B9C] hover:text-[#922B21] hover:bg-[#FDEDEC] border border-[#E6DEF8] transition-colors"
            title="Sign out of Admin Studio"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar - Stable & Sticky */}
        <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 z-20 self-start">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={onSelectTab}
            onLogout={logout}
            counts={{
              products: products.length,
              categories: categories.length,
              orders: orders.length
            }}
          />
        </aside>

        {/* Mobile Slide-over Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-50 w-72 bg-[#FFFDFB] h-full shadow-pastel-lg flex flex-col">
              <div className="p-4 border-b border-[#E6DEF8] flex items-center justify-between">
                <span className="font-serif font-bold text-base text-[#4A3B5C]">
                  Studio Menu
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-[#8A7B9C] hover:bg-[#F5F0FC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  currentTab={currentTab}
                  onSelectTab={(tab) => {
                    onSelectTab(tab);
                    setMobileSidebarOpen(false);
                  }}
                  onLogout={logout}
                  counts={{
                    products: products.length,
                    categories: categories.length,
                    orders: orders.length
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Global Toast */}
      <Toast toast={toastMessage} />
    </div>
  );
}
