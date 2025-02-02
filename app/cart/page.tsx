"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { loadStripe } from '@stripe/stripe-js'
import { useState } from "react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const stripe = await stripePromise
      if (!stripe) throw new Error('Failed to load Stripe')

      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          mode: 'payment',
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cart`,
          line_items: items.map(item => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${item.template.title} - ${item.tier}`,
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          })),
        }),
      })

      const session = await response.json()
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl py-20">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Your cart is empty</h1>
          <p className="text-muted-foreground text-lg">
            Add some templates to your cart to get started.
          </p>
          <div className="pt-6">
            <Button asChild>
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="space-y-8">
        {items.map((item) => (
          <div
            key={`${item.template.id}-${item.tier}`}
            className="flex gap-6 py-6 border-b"
          >
            <div className="relative aspect-square h-24 overflow-hidden rounded-lg">
              <Image
                src={item.template.image}
                alt={item.template.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{item.template.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.tier} Version
                  </p>
                </div>
                <p className="font-semibold">${item.price}</p>
              </div>

              <div className="flex items-center gap-4">
                <Select
                  value={item.quantity.toString()}
                  onValueChange={(value) => {
                    updateQuantity(item.template.id, item.tier, parseInt(value))
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUANTITY_OPTIONS.map((quantity) => (
                      <SelectItem key={quantity} value={quantity.toString()}>
                        {quantity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.template.id, item.tier)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-lg bg-muted p-6">
          <div className="space-y-1">
            <div className="flex justify-between text-base">
              <p>Subtotal</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <p>Tax</p>
              <p>Calculated at checkout</p>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}