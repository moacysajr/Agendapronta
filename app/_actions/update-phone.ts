"use server"

import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

export const UpdatePhone = async (UserId:string, Phone:string) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }
  
  try {
    const updatedPhone = await db.user.update({
      where: { 
        id: UserId,
      },
      data: {
        phone: Phone,
      },
    })

    if (!updatedPhone) {
      throw new Error("Serviço não encontrado ou você não tem permissão para editá-lo")
    }

  } catch (error) {
    throw new Error("Não foi possível atualizar o serviço")
  }
}