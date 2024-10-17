"use client"

import { useState } from "react"

// Definindo um tipo mais flexível para OrderWithItems
type OrderWithItems = {
  id: number
  totalPrice: number | string // Aceita tanto number quanto string
  concluded: boolean
  items: Array<{
    id: number
    quantity: number
    item: {
      id: string
      name: string
      price: number | string // Aceita tanto number quanto string
    }
  }>
}

export default function FinishClient({
  initialOrders,
}: {
  initialOrders: OrderWithItems[]
}) {
  const [orders, setOrders] = useState(initialOrders)

  const handlePaymentComplete = async (orderId: number) => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concluded: true }),
    })

    if (response.ok) {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, concluded: true } : order,
        ),
      )
    }
  }

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return numPrice.toFixed(2)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Pedidos Pendentes</h1>
      {orders.map((order) => (
        <div key={order.id} className="mb-4 rounded border p-4">
          <h2 className="text-xl font-semibold">Pedido #{order.id}</h2>
          <p>Total: R$ {formatPrice(order.totalPrice)}</p>
          <p>Status: {order.concluded ? "Concluído" : "Pendente"}</p>
          <h3 className="mt-2 text-lg font-semibold">Itens:</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.quantity}x {item.item.name} - R${" "}
                {formatPrice(item.item.price)}
              </li>
            ))}
          </ul>
          {!order.concluded && (
            <button
              onClick={() => handlePaymentComplete(order.id)}
              className="mt-2 rounded bg-green-500 px-4 py-2 text-white"
            >
              Marcar como Pago
            </button>
          )}
        </div>
      ))}
    </div>
  )
}