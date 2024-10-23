"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "../_components/ui/button"
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../_components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../_components/ui/alert-dialog"
import useStore from "../store/CartStore"
import { getItems } from "../_actions/get-item"
import { createOrder } from "../_actions/create-order"
import { toast } from "../hooks/use-toast"

// Mantendo as interfaces originais
interface StoreItem {
  id: string
  name: string
  imageUrl: string
  description: string | null
  price: number
  barbershopId: string
  createdAt: Date
  updatedAt: Date
}

interface CartItem extends Omit<StoreItem, "createdAt" | "updatedAt"> {
  quantity: number
}

interface OrderItem {
  id: string
  quantity: number
  price: number
}

interface CreateOrderData {
  items: OrderItem[]
  totalAmount: number
}

interface StoreState {
  items: StoreItem[]
  cart: CartItem[]
  quantities: Record<string, number>
  // eslint-disable-next-line no-unused-vars
  setItems: (items: StoreItem[]) => void
  // eslint-disable-next-line no-unused-vars
  incrementQuantity: (id: string) => void
  // eslint-disable-next-line no-unused-vars
  decrementQuantity: (id: string) => void
  // eslint-disable-next-line no-unused-vars
  addToCart: (item: StoreItem) => void
  clearCart: () => void
}

const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

const ShopItemsSection: React.FC = () => {
  const store = useStore() as StoreState
  const {
    items,
    cart,
    quantities,
    setItems,
    incrementQuantity,
    decrementQuantity,
    addToCart,
    clearCart,
  } = store

  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems()
        const formattedItems = fetchedItems.map((item) => ({
          ...item,
          price: Number(item.price),
        }))
        setItems(formattedItems)
      } catch (error) {
        console.error("Erro ao buscar itens:", error)
        toast({
          title: "Erro",
          description: "Falha ao carregar os produtos.",
          variant: "destructive",
        })
      }
    }

    fetchItems()
  }, [setItems])

  const handleOrderCompletion = async () => {
    setIsLoading(true)
    try {
      if (cart.length === 0) {
        toast({
          title: "Erro",
          description: "Seu carrinho está vazio!",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const totalAmount = cart.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)

      const orderData: CreateOrderData = {
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      }

      const result = await createOrder(orderData)

      if (result.success) {
        setShowConfirmation(true)
        clearCart()
        setIsCartOpen(false)
      } else {
        throw new Error(result.error || "Erro ao processar pedido")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao processar o pedido. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cartTotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  return (
    <div className="relative p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase text-gray-400">Produtos</h2>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                src={item.imageUrl || "/placeholder.png"}
                alt={item.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-medium">{item.name}</h3>
              {item.description && (
                <p className="mt-0.5 text-sm text-gray-400">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="whitespace-nowrap font-medium text-primary">
                R$ {formatPrice(item.price)}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => incrementQuantity(item.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm">
                  {quantities[item.id] || 0}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    if ((quantities[item.id] || 0) > 0) {
                      decrementQuantity(item.id)
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const quantity = quantities[item.id] || 0
                  if (quantity > 0) {
                    addToCart(item)
                  }
                }}
              >
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="relative flex items-center justify-center rounded-full shadow-lg"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-white">
                  {cart.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Carrinho de Compras</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-medium text-gray-800">
                      {item.name}
                    </span>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        R$ {formatPrice(item.price * item.quantity)}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <ShoppingCart className="mr-1 h-4 w-4 text-yellow-500" />
                        Qtd: {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {cart.length > 0 ? (
                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="font-medium">Total:</span>
                    <span className="font-medium text-primary">
                      R$ {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="w-full"
                      onClick={handleOrderCompletion}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Finalizar Pedido"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearCart}
                      disabled={isLoading}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">Seu carrinho está vazio</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogTitle>Pedido Realizado</AlertDialogTitle>
          <AlertDialogDescription>
            Seu pedido foi realizado com sucesso!
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => setShowConfirmation(false)}>
            Fechar
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ShopItemsSection
