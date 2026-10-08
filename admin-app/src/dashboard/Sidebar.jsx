import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  ExternalLink,
  LogOut
} from 'lucide-react';
import WaxSeal from '../components/ui/WaxSeal.jsx';

export default function Sidebar({ currentTab, onSelectTab, onLogout, counts = {} }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, count: counts.products },
    { id: 'categories', label: 'Categories', icon: Layers, count: counts.categories },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: counts.orders },
  ];

  return (
    <div className="w-64 bg-[#FFFDFB] border-r border-[#E6DEF8] flex flex-col justify-between p-5 h-full overflow-y-auto">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
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

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-[#F0E5F5] space-y-1.5">
        <a
          href="http://localhost:5713"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#8F7BD1] hover:bg-[#FAF5FE] transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span>View Storefront</span>
          </div>
          <span className="text-[10px] text-[#8A7B9C]">5713</span>
        </a>

        {onLogout && (
          <button
            onClick={onLogout}
            type="button"
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#8A7B9C] hover:text-[#922B21] hover:bg-[#FDEDEC] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
