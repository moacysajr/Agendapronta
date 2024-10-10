"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"

export async function addTimeSlot(barbershopId: string, time: string) {
	
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
  const newTimeSlot = await db.timeSlot.create({
    data: {
      barbershopId,
      time,
    },
  })
  revalidatePath("/admin")
  revalidatePath("/")
  return newTimeSlot
}