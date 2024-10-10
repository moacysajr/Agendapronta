"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface CreateServiceParams {
  name: string,
  description: string,
  imageUrl: string,
  price: number,
  barbershopId: string,
}

export const createService = async (params: CreateServiceParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  const { name, description, imageUrl, price, barbershopId } = params

  try {
    await db.barbershopService.create({
      data: {
        name,
        description,
        imageUrl,
        price: price,
        barbershopId,
      },
    })

    revalidatePath("/admin/services")
    revalidatePath("/")
  } catch (error) {
    console.error("Erro ao criar serviço:", error)
    throw new Error("Não foi possível criar o serviço")
  }
}