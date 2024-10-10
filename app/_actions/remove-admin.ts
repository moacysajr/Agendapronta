"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface RemoveAdminParams {
  userId: string,
}

export const removeAdmin = async (params: RemoveAdminParams) => {
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

  // Verificar se o usuário que está sendo removido é o próprio usuário atual
  if (userId === session.user.id) {
    throw new Error("Você não pode remover seu próprio status de administrador")
  }

  // Contar o número de administradores
  const adminCount = await db.user.count({
    where: { isAdmin: true }
  })

  // Verificar se o usuário que está sendo atualizado é um admin
  const targetUser = await db.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true }
  })

  if (!targetUser?.isAdmin) {
    throw new Error("O usuário selecionado não é um administrador")
  }

  // Garantir que haverá pelo menos um admin após a remoção
  if (adminCount <= 1) {
    throw new Error("Não é possível remover o último administrador do sistema")
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { isAdmin: false }
    })

    revalidatePath("/admin/clients")
  } catch (error) {
    console.error("Erro ao remover status de administrador do usuário:", error)
  }
}