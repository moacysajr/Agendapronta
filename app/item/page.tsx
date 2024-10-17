"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui/table"
import { Button } from "../_components/ui/button"
import { getItems } from "../_actions/get-item"
import { createOrder } from "../_actions/create-order"
import useStore from "../store/CartStore"
import { toast } from "../hooks/use-toast"
import Header from "../_components/header"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../_components/ui/alert-dialog"

const formatPrice = (
  price: number | string | { toString: () => string },
): string => {
  if (typeof price === "number") {
    return price.toFixed(2)
  } else if (typeof price === "string") {
    return parseFloat(price).toFixed(2)
  } else if (
    typeof price === "object" &&
    price !== null &&
    "toString" in price
  ) {
    return parseFloat(price.toString()).toFixed(2)
  }
  return "0.00"
}

const ItemTable: React.FC = () => {
  const {
    items,
    cart,
    quantities,
    setItems,
    incrementQuantity,
    decrementQuantity,
    addToCart,
    clearCart,
  } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems()
        setItems(fetchedItems)
      } catch (error) {
        console.error("Erro ao buscar itens:", error)
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
        return total + parseFloat(formatPrice(item.price)) * item.quantity
      }, 0)

      const orderData = {
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: parseFloat(formatPrice(item.price)),
        })),
        totalAmount,
      }

      const result = await createOrder(orderData)

      if (result.success) {
        setShowConfirmation(true)
        clearCart()
      } else {
        throw new Error(result.error)
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

  if (items.length === 0) {
    return <div>Carregando itens...</div>
  }

  return (
    <>
      <Header />
      <div className="relative p-5">
        <div className="space-y-3">
          <h1 className="just text-xl font-bold">Catálogo de Itens</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>R$ {formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => decrementQuantity(item.id)}
                        variant="outline"
                        size="sm"
                      >
                        -
                      </Button>
                      <span>{quantities[item.id] || 0}</span>
                      <Button
                        onClick={() => incrementQuantity(item.id)}
                        variant="outline"
                        size="sm"
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => addToCart(item)}
                      variant="default"
                      size="sm"
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h2 className="mb-3 mt-6 text-xl font-bold">Carrinho de Compras</h2>
          {cart.length === 0 ? (
            <p className="text-gray-400">Seu carrinho está vazio.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="mb-2 flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <Image
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  width={30}
                  height={30}
                  className="mr-2 rounded object-cover"
                />
                <span>{item.name}</span>
                <span>Quantidade: {item.quantity}</span>
                <span>
                  R${" "}
                  {(
                    parseFloat(formatPrice(item.price)) * item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))
          )}

          <div className="mt-4 flex space-x-2">
            <Button
              onClick={handleOrderCompletion}
              variant="default"
              size="sm"
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
              onClick={clearCart}
              variant="destructive"
              size="sm"
              disabled={isLoading}
            >
              Limpar Carrinho
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogTitle>Pedido Confirmado</AlertDialogTitle>
          <AlertDialogDescription>
            Seu pedido foi realizado com sucesso!
          </AlertDialogDescription>
          <AlertDialogAction onClick={() => setShowConfirmation(false)}>
            OK
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ItemTable
