import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout.jsx';
import StatCard from './StatCard.jsx';
import ProductsManager from './ProductsManager.jsx';
import CategoriesManager from './CategoriesManager.jsx';
import OrdersTable from './OrdersTable.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { Package, Layers, ShoppingBag, DollarSign, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import ProductIllustration from '../components/product/ProductIllustration.jsx';

export default function Dashboard() {
  const { products, categories, orders } = useProducts();
  const [currentTab, setCurrentTab] = useState('overview');

  // Computed stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0) + 3840.50; // seeded baseline
  const activeProductsCount = products.filter(p => p.isActive !== false).length;
  const subscriptionsCount = products.filter(p => p.isSubscription).length;

  return (
    <DashboardLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
      {currentTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3B5C]">
                Studio Performance Overview
              </h1>
              <p className="text-xs sm:text-sm text-[#8A7B9C] mt-1 font-sans">
                Real-time snapshot of your snail mail club, catalogue inventory, and shipments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentTab('products')}
              >
                Manage Products
              </Button>
            </div>
          </div>

          {/* Animated Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Est. Revenue"
              value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle="vs last month"
              trend="+18.4%"
              icon={DollarSign}
              color="#117A65"
              bg="#E8F8F5"
            />
            <StatCard
              title="Active Orders"
              value={orders.length}
              subtitle="Parcels in dispatch"
              trend="+3 new"
              icon={ShoppingBag}
              color="#8F7BD1"
              bg="#FAF5FE"
            />
            <StatCard
              title="Treasures in Store"
              value={activeProductsCount}
              subtitle={`${products.length - activeProductsCount} hidden`}
              icon={Package}
              color="#F4A6C4"
              bg="#FDE8F0"
            />
            <StatCard
              title="Active Categories"
              value={categories.length}
              subtitle="Curated avenues"
              icon={Layers}
              color="#D4AF37"
              bg="#FEF9E7"
            />
          </div>

          {/* Pastel Charts & Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Chart: Monthly Correspondence Shipments */}
            <div className="lg:col-span-8 bg-[#FFFDFB] rounded-[28px] border border-[#E6DEF8] p-6 sm:p-8 shadow-pastel space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#4A3B5C]">
                    Monthly Snail Mail Shipments
                  </h3>
                  <p className="text-xs text-[#8A7B9C]">
                    Wax-sealed correspondence delivered across 2026
                  </p>
                </div>
                <span className="text-xs text-[#8F7BD1] font-bold bg-[#FAF5FE] px-3 py-1 rounded-full border border-[#E6DEF8]">
                  +32% Growth ✿
                </span>
              </div>

              {/* Pastel Bar Chart Visual */}
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-[#F0E5F5]">
                {[
                  { month: 'Apr', parcels: 340, height: '45%' },
                  { month: 'May', parcels: 410, height: '55%' },
                  { month: 'Jun', parcels: 490, height: '65%' },
                  { month: 'Jul', parcels: 560, height: '75%' },
                  { month: 'Aug', parcels: 680, height: '88%' },
                  { month: 'Sep', parcels: 790, height: '100%' },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#8A7B9C] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {bar.parcels}
                    </span>
                    <div
                      style={{ height: bar.height }}
                      className="w-full max-w-[42px] bg-gradient-to-t from-[#B9A7E8] to-[#F8C8DC] rounded-t-xl group-hover:from-[#8F7BD1] group-hover:to-[#F4A6C4] transition-all shadow-xs"
                    />
                    <span className="text-xs font-semibold text-[#6B5B7D]">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[#8A7B9C] pt-1">
                <span>Total Postal Volume: 3,270 Parcels</span>
                <span>Average delivery duration: 4.2 days</span>
              </div>
            </div>

            {/* Right Card: Quick Actions & Live Catalogue Snapshot */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FAF5FE] rounded-[28px] border border-[#E6DEF8] p-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-[#4A3B5C]">
                  Quick Catalogue Shortcuts
                </h3>
                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => setCurrentTab('products')}
                    className="w-full p-3 bg-white rounded-xl border border-[#E6DEF8] hover:border-[#B9A7E8] flex items-center justify-between transition-colors text-left"
                  >
                    <div>
                      <strong className="text-[#4A3B5C] block">Manage Product Inventory</strong>
                      <span className="text-[#8A7B9C]">{products.length} products listed</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8F7BD1]" />
                  </button>

                  <button
                    onClick={() => setCurrentTab('categories')}
                    className="w-full p-3 bg-white rounded-xl border border-[#E6DEF8] hover:border-[#B9A7E8] flex items-center justify-between transition-colors text-left"
                  >
                    <div>
                      <strong className="text-[#4A3B5C] block">Reorder Collections</strong>
                      <span className="text-[#8A7B9C]">{categories.length} categories active</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8F7BD1]" />
                  </button>

                  <button
                    onClick={() => setCurrentTab('orders')}
                    className="w-full p-3 bg-white rounded-xl border border-[#E6DEF8] hover:border-[#B9A7E8] flex items-center justify-between transition-colors text-left"
                  >
                    <div>
                      <strong className="text-[#4A3B5C] block">Process Customer Orders</strong>
                      <span className="text-[#8A7B9C]">{orders.length} orders recorded</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8F7BD1]" />
                  </button>
                </div>
              </div>

              {/* Gentle affirmation reminder card */}
              <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#FFF9F4] to-[#FDE8F0]/40 border border-[#E6DEF8] text-xs text-[#6B5B7D] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8F7BD1]">
                  <Sparkles className="w-4 h-4 text-[#F4A6C4]" />
                  <span>Studio Reminder</span>
                </div>
                <p className="font-handwritten text-base text-[#4A3B5C] leading-snug">
                  "Every letter you stamp is a seed of gentle peace planted in someone's day."
                </p>
              </div>
            </div>

          </div>

          {/* Recent Orders Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#4A3B5C]">
                Recent Customer Orders
              </h3>
              <button
                onClick={() => setCurrentTab('orders')}
                className="text-xs text-[#8F7BD1] font-semibold hover:underline"
              >
                View all orders →
              </button>
            </div>
            <OrdersTable />
          </div>

        </div>
      )}

      {currentTab === 'products' && <ProductsManager />}
      {currentTab === 'categories' && <CategoriesManager />}
      {currentTab === 'orders' && <OrdersTable />}
    </DashboardLayout>
  );
}
