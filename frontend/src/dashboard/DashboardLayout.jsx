import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { Bell, Menu, X, ArrowUpRight } from 'lucide-react';
import { useProducts } from '../context/ProductsContext.jsx';
import Toast from '../components/ui/Toast.jsx';

export default function DashboardLayout({
  currentTab,
  onSelectTab,
  children
}) {
  const { products, categories, orders, toastMessage, showToast } = useProducts();
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
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E8F8F5] text-[#117A65] font-semibold border border-[#A3E4D7]">
              ● In-Memory Live Sync
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8F7BD1] font-semibold hover:underline"
          >
            <span>Live Catalog Preview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => showToast("All systems gentle and operational! ✿")}
            className="w-8 h-8 rounded-full bg-[#FAF5FE] text-[#8F7BD1] flex items-center justify-center hover:bg-[#E6DEF8] transition-colors"
            title="Studio notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={onSelectTab}
            counts={{
              products: products.length,
              categories: categories.length,
              orders: orders.length
            }}
          />
        </div>

        {/* Mobile Sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-[#2C2138]/40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-50">
              <Sidebar
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  onSelectTab(tab);
                  setMobileSidebarOpen(false);
                }}
                counts={{
                  products: products.length,
                  categories: categories.length,
                  orders: orders.length
                }}
              />
            </div>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Global Toast inside dashboard */}
      <Toast toast={toastMessage} />
    </div>
  );
}
