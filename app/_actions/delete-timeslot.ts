"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteTimeSlot(id: string) {
	const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { success: false, message: "Usuário não autenticado" }
  }

  const deletedTimeSlot = db.timeSlot.delete({
    where: { id },
  })
  revalidatePath("/admin")
  revalidatePath("/")

  return deletedTimeSlot
}