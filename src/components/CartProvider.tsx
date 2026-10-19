"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  sellerName?: string;
  riskScore?: number;
  riskTier?: string;
}

export interface CartItemType {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItemType[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  taxFee: number;
  total: number;
  avgRiskScore: number;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  sessionId: string;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  shippingFee: 0,
  taxFee: 0,
  total: 0,
  avgRiskScore: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  sessionId: "session-default",
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [sessionId, setSessionId] = useState<string>("session-init");

  useEffect(() => {
    // Generate or load persistent session ID
    let sid = localStorage.getItem("trustcart-session-id");
    if (!sid) {
      sid = "tc_sess_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("trustcart-session-id", sid);
    }
    setSessionId(sid);

    // Load saved cart items
    try {
      const saved = localStorage.getItem("trustcart-cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveItems = (newItems: CartItemType[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("trustcart-cart", JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const addItem = (product: CartProduct, quantity: number = 1) => {
    const existingIndex = items.findIndex((i) => i.product.id === product.id);
    let updated: CartItemType[];
    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...items, { product, quantity }];
    }
    saveItems(updated);
  };

  const removeItem = (productId: string) => {
    const updated = items.filter((i) => i.product.id !== productId);
    saveItems(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const updated = items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(
    items
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      .toFixed(2)
  );
  const shippingFee = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const taxFee = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + shippingFee + taxFee).toFixed(2));

  const totalWeightedRisk = items.reduce(
    (sum, item) => sum + (item.product.riskScore ?? 20) * item.quantity,
    0
  );
  const avgRiskScore = itemCount > 0 ? Math.round(totalWeightedRisk / itemCount) : 12;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingFee,
        taxFee,
        total,
        avgRiskScore,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        sessionId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
