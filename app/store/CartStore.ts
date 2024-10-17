import { create } from "zustand"

interface Item {
  id: string
  name: string
  imageUrl: string
  description: string | null
  price: number | string | { toString: () => string }
  barbershopId: string
  createdAt: Date
  updatedAt: Date
}

interface CartItem extends Item {
  quantity: number
}

interface StoreState {
  items: Item[]
  cart: CartItem[]
  quantities: { [key: string]: number }
  // eslint-disable-next-line no-unused-vars
  setItems: (items: Item[]) => void
  // eslint-disable-next-line no-unused-vars
  incrementQuantity: (itemId: string) => void
  // eslint-disable-next-line no-unused-vars
  decrementQuantity: (itemId: string) => void
  // eslint-disable-next-line no-unused-vars
  addToCart: (item: Item) => void
  clearCart: () => void
}

const useStore = create<StoreState>((set) => ({
  items: [],
  cart: [],
  quantities: {},
  setItems: (items) => set({ items }),
  incrementQuantity: (itemId) =>
    set((state) => ({
      quantities: {
        ...state.quantities,
        [itemId]: (state.quantities[itemId] || 0) + 1,
      },
    })),
  decrementQuantity: (itemId) =>
    set((state) => ({
      quantities: {
        ...state.quantities,
        [itemId]: Math.max((state.quantities[itemId] || 0) - 1, 0),
      },
    })),
  addToCart: (item) =>
    set((state) => {
      const quantity = state.quantities[item.id] || 0
      if (quantity > 0) {
        const existingItem = state.cart.find(
          (cartItem) => cartItem.id === item.id,
        )
        const newCart = existingItem
          ? state.cart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem,
            )
          : [...state.cart, { ...item, quantity }]
        return {
          cart: newCart,
          quantities: { ...state.quantities, [item.id]: 0 },
        }
      }
      return state
    }),
  clearCart: () => set({ cart: [] }),
}))

export default useStore
