"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { Decimal } from "@prisma/client/runtime/library"

interface UpdateItemParams {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
}

export const updateItem = async (item: UpdateItemParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  try {
    const updatedItem = await db.item.update({
      where: {
        id: item.id,
      },
      data: {
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        price: new Decimal(item.price),
      },
    })

    if (!updatedItem) {
      throw new Error(
        "Serviço não encontrado ou você não tem permissão para editá-lo",
      )
    }

    revalidatePath("/admin/items")
    revalidatePath("/")
  } catch (error) {
    throw new Error("Não foi possível atualizar o serviço")
  }
}
