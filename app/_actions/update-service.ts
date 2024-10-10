"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { Decimal } from '@prisma/client/runtime/library';

interface UpdateServiceParams {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
}

export const updateService = async (service: UpdateServiceParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  try {
    const updatedService = await db.barbershopService.update({
      where: { 
        id: service.id,
      },
      data: {
        name: service.name,
        description: service.description,
        imageUrl: service.imageUrl,
        price: new Decimal(service.price),
      },
    })

    if (!updatedService) {
      throw new Error("Serviço não encontrado ou você não tem permissão para editá-lo")
    }

    revalidatePath("/admin/services")
    revalidatePath("/")
  } catch (error) {
    throw new Error("Não foi possível atualizar o serviço")
  }
}