import { PrismaClient } from "@prisma/client"
import FinishClient from "./FinishClient"

const prisma = new PrismaClient()

export default async function FinishPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          item: true,
        },
      },
    },
  })

  const formattedOrders = orders.map((order) => ({
    ...order,
    totalPrice: order.totalPrice.toNumber(),
    items: order.items.map((orderItem) => ({
      ...orderItem,
      item: {
        ...orderItem.item,
        price: orderItem.item.price.toString(),
      },
    })),
  }))

  return <FinishClient initialOrders={formattedOrders} />
}
