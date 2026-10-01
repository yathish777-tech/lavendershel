import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useProducts } from '../../context/ProductsContext.jsx';
import Drawer from '../ui/Drawer.jsx';
import Button from '../ui/Button.jsx';
import CartItem from './CartItem.jsx';
import confetti from 'canvas-confetti';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    discountCode,
    setDiscountCode,
    appliedDiscount,
    subtotal,
    discountAmount,
    shipping,
    total,
    totalItemsCount
  } = useCart();

  const { addOrder, showToast } = useProducts();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  // Simple checkout form fields
  const [customerName, setCustomerName] = useState('Evelyn Rose');
  const [customerEmail, setCustomerEmail] = useState('evelyn.rose@lavendershell.co');
  const [shippingAddress, setShippingAddress] = useState('742 Whispering Petals Lane, Apt 4B');
  const [giftNote, setGiftNote] = useState('');

  const freeShippingThreshold = 45;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Create live order in ProductsContext
    const newOrder = addOrder({
      customerName,
      email: customerEmail,
      itemsCount: totalItemsCount,
      total,
      address: shippingAddress,
      giftNote: giftNote || undefined,
      items: cart.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        variant: i.variant?.name
      }))
    });

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#B9A7E8', '#F8C8DC', '#FFEAA7', '#8F7BD1']
      });
    } catch {
      // fallback
    }

    setCheckoutSuccess(newOrder);
    clearCart();
    showToast(`Order #${newOrder.id} confirmed with love! 💌`);
  };

  const handleClose = () => {
    setIsCheckingOut(false);
    setCheckoutSuccess(null);
    closeCart();
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={handleClose}
      title="Your Snail Mail Bag"
      subtitle={`${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'} waiting for you`}
      width="max-w-md"
    >
      <div className="flex flex-col h-full justify-between">
        
        {/* If Order Just Succeeded */}
        {checkoutSuccess ? (
          <div className="py-10 px-2 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E6DEF8] text-[#8F7BD1] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#4A3B5C]">
              Order Confirmed! ✿
            </h4>
            <p className="text-xs text-[#6B5B7D] max-w-xs mx-auto leading-relaxed">
              Thank you, {checkoutSuccess.customerName}. Your tracking number is <strong className="text-[#4A3B5C]">{checkoutSuccess.trackingNumber}</strong>. We've melted the lavender wax and are preparing your package!
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF5FE] border border-[#E6DEF8] text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8A7B9C]">Order ID:</span>
                <span className="font-bold text-[#4A3B5C]">{checkoutSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A7B9C]">Total Paid:</span>
                <span className="font-bold text-[#4A3B5C]">${checkoutSuccess.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A7B9C]">Status:</span>
                <span className="text-[#8F7BD1] font-semibold">{checkoutSuccess.status}</span>
              </div>
            </div>
            <Button variant="primary" size="md" onClick={handleClose}>
              Continue Exploring
            </Button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Bag State */
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FDE8F0] flex items-center justify-center text-3xl">
              🐚
            </div>
            <h4 className="font-serif text-lg font-bold text-[#4A3B5C]">
              Your postal bag is empty
            </h4>
            <p className="text-xs text-[#8A7B9C] max-w-xs mx-auto">
              Treat your soul to an illustrated letter, guided journal, or celestial stickers.
            </p>
            <div className="pt-3">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Browse Collections
              </Button>
            </div>
          </div>
        ) : (
          /* Active Bag Contents & Checkout */
          <div className="space-y-5">
            {/* Free Shipping Progress Indicator */}
            <div className="bg-[#FAF5FE] p-3 rounded-2xl border border-[#E6DEF8]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#4A3B5C]">
                  {remainingForFreeShipping > 0
                    ? `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping`
                    : 'Yay! You unlocked Free Shipping! ✿'}
                </span>
                <span className="text-[10px] text-[#8F7BD1] font-bold">
                  {Math.round(progressToFreeShipping)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#E6DEF8] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#B9A7E8] to-[#F4A6C4] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
              <AnimatePresence>
                {cart.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Promo Code Input */}
            {!isCheckingOut && (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. PASTELDREAM)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3.5 py-1.5 text-xs bg-white border border-[#E6DEF8] rounded-full outline-none focus:border-[#B9A7E8] text-[#4A3B5C]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[#E6DEF8] text-[#4A3B5C] hover:bg-[#D4C6F4] transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {promoFeedback && (
              <p className={`text-xs ${promoFeedback.success ? 'text-[#117A65]' : 'text-rose-500'}`}>
                {promoFeedback.message}
              </p>
            )}

            {/* Simulated Checkout Form */}
            {isCheckingOut && (
              <form id="checkout-form" onSubmit={handleCompleteOrder} className="p-4 rounded-2xl bg-[#FFF9F4] border border-[#E6DEF8] space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-[#4A3B5C] uppercase tracking-wider">
                    Recipient & Delivery
                  </h5>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-[11px] text-[#8F7BD1] hover:underline"
                  >
                    Back to Bag
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#E6DEF8] rounded-xl outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email for dispatch updates"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#E6DEF8] rounded-xl outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Mailing Address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#E6DEF8] rounded-xl outline-none"
                />
                <input
                  type="text"
                  placeholder="Personal gift card note (optional)"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#E6DEF8] rounded-xl outline-none"
                />
              </form>
            )}

            {/* Price Calculations */}
            <div className="pt-3 border-t border-[#F0E5F5] space-y-1.5 text-xs text-[#6B5B7D]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#4A3B5C] tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#117A65]">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {shipping === 0 ? <strong className="text-[#117A65]">FREE</strong> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#4A3B5C] pt-2 border-t border-[#F0E5F5]">
                <span>Estimated Total</span>
                <span className="text-base text-[#8F7BD1] tabular-nums">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-2">
              {isCheckingOut ? (
                <Button
                  type="submit"
                  form="checkout-form"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Place Order (${total.toFixed(2)}) ✿</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsCheckingOut(true)}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
