import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuoteCartItem {
  productId: string;
  productName: string;
  category: string;
  imageUrl: string;
  moq: string;
  quantity: number;
}

interface QuoteCartState {
  items: QuoteCartItem[];
  isOpen: boolean;
  addToCart: (item: Omit<QuoteCartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  getCartTotal: () => number;
}

export const useQuoteCart = create<QuoteCartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 50 }
                  : i,
              ),
            };
          }
          const minQty = Math.max(50, Number.parseInt(item.moq) || 50);
          return {
            items: [...state.items, { ...item, quantity: minQty }],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, qty) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(50, qty) }
              : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setOpen: (open) => set({ isOpen: open }),

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "gemora-quote-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
