"use client"

import { Template } from "@/types/template"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/templates/${template.category}/${template.id}`)
  }

  return (
    <Card className="group flex flex-col h-full">
      <div 
        onClick={handleCardClick}
        className="flex-1 cursor-pointer"
      >
        <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
          <Image
            src={template.image}
            alt={template.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="flex flex-col flex-1 p-6">
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {template.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {template.description}
            </p>
            {template.recommendedFor && (
              <div className="flex flex-wrap gap-2 mb-4">
                {template.recommendedFor.map((industry) => (
                  <Badge 
                    key={industry} 
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {template.features.slice(0, 2).map((feature) => (
              <div key={feature} className="flex items-center text-sm">
                <span className="mr-2">•</span>
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
            <div className="flex items-center text-sm text-primary font-medium">
              <span className="mr-2">View Details</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-6 mt-auto border-t bg-muted/10">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold">${template.price}</span>
          <Button asChild>
            <Link href={`/templates/${template.category}/${template.id}`}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}