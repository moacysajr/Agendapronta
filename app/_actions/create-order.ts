"use server"

import { prisma } from "../_lib/prisma"
import { revalidatePath } from "next/cache"

interface CreateOrderData {
  items: {
    id: string
    quantity: number
    price: number
  }[]
  totalAmount: number
}

export async function createOrder(data: CreateOrderData) {
  try {
    const order = await prisma.order.create({
      data: {
        totalPrice: data.totalAmount,
        items: {
          create: data.items.map((item) => ({
            quantity: item.quantity,
            item: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    })

    revalidatePath("/")
    return { success: true, data: order }
  } catch (error) {
    console.error("[CREATE_ORDER]", error)
    return { success: false, error: "Falha ao criar o pedido." }
  }
}
