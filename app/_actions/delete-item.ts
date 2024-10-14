"use server"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { revalidatePath } from "next/cache"

export const deleteItem = async (formData: FormData) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { success: false, message: "Usuário não autenticado" }
  }

  const itemId = formData.get("id")?.toString()
  if (!itemId) {
    return { success: false, message: "ID do item não fornecido" }
  }

  try {
    await db.item.delete({
      where: {
        id: itemId,
      },
    })

    revalidatePath("/admin/items")
    revalidatePath("/")
    return { success: true, message: "Item deletado com sucesso!" }
  } catch (error) {
    console.error("Erro ao deletar item:", error)
    return {
      success: false,
      message: `Ocorreu um erro ao tentar deletar o item. Por favor, tente novamente.`,
    }
  }
}
