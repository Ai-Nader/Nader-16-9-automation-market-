import { Template } from "@/types/template"

export type CartTier = 'template' | 'customized' | 'full-service'

export interface CartItem {
  template: Template
  quantity: number
  tier: CartTier
  price: number
}

export interface CartState {
  items: CartItem[]
  total: number
  addItem: (templateId: string, tier: CartTier) => { success: boolean; error?: string }
  removeItem: (templateId: string, tier: CartTier) => void
  updateQuantity: (templateId: string, tier: CartTier, quantity: number) => void
  clearCart: () => void
}

export function getTierPrice(template: Template, tier: CartTier): number {
  if (!template || typeof template.price !== 'number' || isNaN(template.price)) {
    throw new Error('Invalid template or price')
  }

  switch (tier) {
    case 'customized':
      return template.price + 99
    case 'full-service':
      return template.price + 299
    case 'template':
      return template.price
    default:
      throw new Error(`Invalid tier: ${tier}`)
  }
}