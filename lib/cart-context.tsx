'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import type { DesignState } from './designer-types';

export type BagLine = {
  id: string;
  baseId: string;
  baseName: string;
  design: DesignState;
  price: number;
  size: string | null;
};

type CartState = {
  lines: BagLine[];
  addLine: (line: Omit<BagLine, 'id'>) => string;
  removeLine: (id: string) => void;
  setLineSize: (id: string, size: string) => void;
  clear: () => void;
  total: number;
  ready: boolean;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = 'bubblehops_bag';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const addLine = useCallback((line: Omit<BagLine, 'id'>) => {
    const id = `bag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setLines((prev) => [...prev, { ...line, id }]);
    return id;
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setLineSize = useCallback((id: string, size: string) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, size } : l)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const total = lines.reduce((sum, l) => sum + l.price, 0);

  return (
    <CartContext.Provider value={{ lines, addLine, removeLine, setLineSize, clear, total, ready }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
