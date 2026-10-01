import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, ChevronDown, Eye } from 'lucide-react';
import { useProducts } from '../context/ProductsContext.jsx';
import Modal from '../components/ui/Modal.jsx';

export default function OrdersTable() {
  const { orders, updateOrderStatus } = useProducts();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    'Processing': 'bg-[#FEF9E7] text-[#9A7D0A] border-[#F9E79F]',
    'Shipped': 'bg-[#EBF5FB] text-[#2471A3] border-[#AED6F1]',
    'Delivered': 'bg-[#E8F8F5] text-[#117A65] border-[#A3E4D7]',
    'Cancelled': 'bg-[#FDEDEC] text-[#922B21] border-[#F5B7B1]'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#4A3B5C]">
          Snail Mail Orders & Parcels
        </h2>
        <p className="text-xs text-[#8A7B9C] mt-0.5">
          Real-time in-memory orders created through the storefront checkout.
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-[#FFFDFB] rounded-[24px] border border-[#E6DEF8] shadow-pastel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#6B5B7D]">
            <thead className="bg-[#FAF5FE] text-[#4A3B5C] font-serif uppercase tracking-wider text-[11px] border-b border-[#E6DEF8]">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Items</th>
                <th className="py-3.5 px-3">Total</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EDF8]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF6FE]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#4A3B5C]">
                    #{order.id}
                  </td>
                  <td className="py-3 px-3 tabular-nums">
                    {order.date}
                  </td>
                  <td className="py-3 px-3">
                    <strong className="text-[#4A3B5C] block">{order.customerName}</strong>
                    <span className="text-[11px] text-[#8A7B9C]">{order.email}</span>
                  </td>
                  <td className="py-3 px-3 tabular-nums">
                    {order.itemsCount} {order.itemsCount === 1 ? 'parcel' : 'items'}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#4A3B5C] tabular-nums">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border outline-none cursor-pointer ${
                        statusColors[order.status] || statusColors['Processing']
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 rounded-xl text-xs font-semibold text-[#8F7BD1] hover:bg-[#FAF5FE] border border-[#E6DEF8] transition-colors"
                    >
                      View Items
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order #${selectedOrder.id}` : ''}
        subtitle="Customer delivery details and purchased stationery"
        maxWidth="max-w-lg"
      >
        {selectedOrder && (
          <div className="space-y-4 pt-2 text-xs text-[#6B5B7D]">
            <div className="p-3.5 rounded-2xl bg-[#FAF5FE] border border-[#E6DEF8] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8A7B9C]">Customer:</span>
                <span className="font-bold text-[#4A3B5C]">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A7B9C]">Email:</span>
                <span className="text-[#4A3B5C]">{selectedOrder.email}</span>
              </div>
              {selectedOrder.address && (
                <div className="flex justify-between">
                  <span className="text-[#8A7B9C]">Address:</span>
                  <span className="text-[#4A3B5C] text-right">{selectedOrder.address}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#8A7B9C]">Tracking:</span>
                <span className="font-mono text-[#8F7BD1]">{selectedOrder.trackingNumber}</span>
              </div>
            </div>

            {selectedOrder.giftNote && (
              <div className="p-3 bg-[#FFF9F4] rounded-xl border border-[#E6DEF8]">
                <strong className="text-[#4A3B5C] block mb-0.5">Gift Note:</strong>
                <p className="italic font-handwritten text-sm text-[#4A3B5C]">
                  "{selectedOrder.giftNote}"
                </p>
              </div>
            )}

            <div>
              <h5 className="font-serif font-bold text-sm text-[#4A3B5C] mb-2">
                Purchased Treasures:
              </h5>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-[#F0E5F5] flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#4A3B5C] block">{item.name}</strong>
                      {item.variant && (
                        <span className="text-[10px] text-[#8A7B9C]">Variant: {item.variant}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="tabular-nums">Qty: {item.quantity}</span>
                      <span className="block font-bold text-[#4A3B5C] tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0E5F5] flex justify-between items-center text-sm font-bold text-[#4A3B5C]">
              <span>Total Paid</span>
              <span className="text-[#8F7BD1] text-base tabular-nums">
                ${selectedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
