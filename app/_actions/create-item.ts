"use server"

import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { revalidatePath } from "next/cache"
interface CreateItemParams {
  name: string
  description?: string // A descrição é opcional
  imageUrl: string
  price: number
  barbershopId: string
}
export const createItem = async (params: CreateItemParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  const { name, description, imageUrl, price, barbershopId } = params

  // Validação
  if (!name || !description || !imageUrl || !price || !barbershopId) {
    throw new Error("Todos os parâmetros são obrigatórios")
  }

  try {
    // Criando um novo item na tabela correta
    const newItem = await db.item.create({
      data: {
        name,
        description,
        imageUrl,
        price: price, // Certifique-se de que o preço está no formato correto
        barbershopId,
      },
    })
    revalidatePath("/admin/items")
    revalidatePath("/")
    console.log("Item criado:", newItem) // Log do novo item
    return newItem // Retorne o novo item
  } catch (error) {
    console.error("Erro ao criar o item:", error)
    throw new Error("Não foi possível criar o item")
  }
}
