import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'coldtech_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      localStorage.removeItem(KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const id = product._id || product.id;
      const existing = prev.find((p) => p.productId === id);
      if (existing) {
        return prev.map((p) =>
          p.productId === id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [
        ...prev,
        {
          productId: id,
          name: product.name,
          image: product.images?.[0],
          quantity: qty,
          sellingPrice: product.sellingPrice,
          discount: product.discount || 0,
        },
      ];
    });
  };

  const updateQty = (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity } : p)));
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, line) => {
      const price =
        line.discount > 0
          ? line.sellingPrice * (1 - line.discount / 100)
          : line.sellingPrice;
      return sum + price * line.quantity;
    }, 0);
  }, [items]);

  const count = useMemo(() => items.reduce((n, l) => n + l.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQty,
      removeItem,
      clear,
      subtotal,
      count,
    }),
    [items, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
