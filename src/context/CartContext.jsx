import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import confetti from 'canvas-confetti';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('lavendershell_cart', []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // percentage, e.g. 15 for 15%
  const [cartBounce, setCartBounce] = useState(false);

  const triggerCartBounce = () => {
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600);
  };

  const addToCart = (product, options = {}) => {
    const {
      quantity = 1,
      variant = product.variants?.[0] || null,
      isSubscription = false,
      subscriptionPlan = null
    } = options;

    const cartItemId = `${product.id}-${variant?.id || 'standard'}-${isSubscription ? subscriptionPlan?.id || 'sub' : 'onetime'}`;

    const effectivePrice = isSubscription && subscriptionPlan
      ? subscriptionPlan.price
      : product.price;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: effectivePrice,
            regularPrice: product.price,
            variant,
            isSubscription,
            subscriptionPlan,
            quantity,
            illustrationType: product.illustrationType || 'envelope',
            stock: product.stock
          }
        ];
      }
    });

    triggerCartBounce();

    // Trigger sweet sparkle burst
    try {
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#B9A7E8', '#F8C8DC', '#E6DEF8', '#FFF9F4', '#D4AF37'],
        disableForReducedMotion: true
      });
    } catch {
      // safe fallback if reduced motion or headless
    }
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.min(newQty, item.stock || 99) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode('');
    setAppliedDiscount(0);
  };

  const applyPromoCode = (code) => {
    const cleaned = (code || '').trim().toUpperCase();
    if (cleaned === 'PASTELDREAM' || cleaned === 'LAVENDER15') {
      setAppliedDiscount(15);
      return { success: true, message: '15% Off Applied! ✿' };
    }
    if (cleaned === 'SELFCARE10' || cleaned === 'WELCOME10') {
      setAppliedDiscount(10);
      return { success: true, message: '10% Off Applied! ♡' };
    }
    return { success: false, message: 'Invalid or expired code. Try "PASTELDREAM"' };
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = Math.max(0, subtotal - discountAmount + shipping);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
        addToCart,
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
        totalItemsCount,
        cartBounce
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
