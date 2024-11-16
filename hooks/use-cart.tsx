"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartState, CartItem, getTierPrice } from '@/lib/cart'
import { getTemplateById } from '@/lib/templates'

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (templateId: string, tier: CartItem['tier']) => {
        try {
          const template = getTemplateById(templateId)
          if (!template) {
            throw new Error(`Template not found: ${templateId}`)
          }

          const price = getTierPrice(template, tier)
          if (typeof price !== 'number' || isNaN(price)) {
            throw new Error('Invalid price')
          }

          set((state) => {
            const existingItem = state.items.find(
              (item) => item.template.id === templateId && item.tier === tier
            )

            if (existingItem) {
              return {
                ...state,
                items: state.items.map((item) =>
                  item.template.id === templateId && item.tier === tier
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
                total: state.total + price,
              }
            }

            return {
              ...state,
              items: [...state.items, { template, quantity: 1, tier, price }],
              total: state.total + price,
            }
          })

          return { success: true }
        } catch (error) {
          console.error('Error adding item to cart:', error)
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to add item to cart' 
          }
        }
      },
      removeItem: (templateId: string, tier: CartItem['tier']) => {
        set((state) => {
          const item = state.items.find(
            (item) => item.template.id === templateId && item.tier === tier
          )
          if (!item) return state

          return {
            ...state,
            items: state.items.filter(
              (item) => !(item.template.id === templateId && item.tier === tier)
            ),
            total: state.total - item.price * item.quantity,
          }
        })
      },
      updateQuantity: (templateId: string, tier: CartItem['tier'], quantity: number) => {
        if (quantity < 1) return

        set((state) => {
          const item = state.items.find(
            (item) => item.template.id === templateId && item.tier === tier
          )
          if (!item) return state

          const quantityDiff = quantity - item.quantity
          return {
            ...state,
            items: state.items.map((item) =>
              item.template.id === templateId && item.tier === tier
                ? { ...item, quantity }
                : item
            ),
            total: state.total + item.price * quantityDiff,
          }
        })
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
)