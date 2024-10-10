"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface MakeAdminParams {
  userId: string,
}

export const makeAdmin = async (params: MakeAdminParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  // Verificar se o usuário atual é um admin
  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  })

  if (!currentUser?.isAdmin) {
    throw new Error("Permissão negada: Apenas administradores podem realizar esta ação")
  }

  const { userId } = params

  try {
    await db.user.update({
      where: { id: userId },
      data: { isAdmin: true }
    })
    revalidatePath("/admin/clients")
  } catch (error) {
    throw new Error("Não foi possível promover o usuário a administrador")
  }
}