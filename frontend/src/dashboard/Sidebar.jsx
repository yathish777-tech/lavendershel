import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import WaxSeal from '../components/ui/WaxSeal.jsx';

export default function Sidebar({ currentTab, onSelectTab, counts = {} }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, count: counts.products },
    { id: 'categories', label: 'Categories', icon: Layers, count: counts.categories },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: counts.orders },
  ];

  return (
    <aside className="w-64 bg-[#FFFDFB] border-r border-[#E6DEF8] flex flex-col justify-between p-5 min-h-[calc(100vh-64px)]">
      {/* Brand & Menu */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <WaxSeal size={36} motif="shell" color="#8F7BD1" />
          <div>
            <h2 className="font-serif font-bold text-base text-[#4A3B5C]">
              Lavendershell
            </h2>
            <p className="text-[11px] text-[#8A7B9C]">Studio Manager</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#B9A7E8] text-[#4A3B5C] font-semibold shadow-sm'
                    : 'text-[#6B5B7D] hover:bg-[#FAF5FE] hover:text-[#4A3B5C]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                    isActive ? 'bg-white text-[#4A3B5C]' : 'bg-[#F0E5F5] text-[#8A7B9C]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Storefront return link */}
      <div className="pt-4 border-t border-[#F0E5F5]">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#8F7BD1] hover:bg-[#FAF5FE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
