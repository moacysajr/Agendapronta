"use server"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { revalidatePath } from "next/cache"

export const deleteService = async (formData: FormData) => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { success: false, message: "Usuário não autenticado" }
  }

  const serviceId = formData.get("id")?.toString()
  if (!serviceId) {
    return { success: false, message: "ID do serviço não fornecido" }
  }

  try {
    const bookingsCount = await db.booking.count({
      where: {
        serviceId: serviceId
      }
    })

    if (bookingsCount > 0) {
      return { 
        success: false, 
        message: "Não é possível excluir este serviço porque existem agendamentos associados a ele." 
      }
    }

    await db.barbershopService.delete({
      where: {
        id: serviceId,
      },
    })

    revalidatePath("/admin/services")
    revalidatePath("/")
    return { success: true, message: "Serviço deletado com sucesso!" }
  } catch (error) {
    console.error("Erro ao deletar serviço:", error)
    return { success: false, message: `Ocorreu um erro ao tentar deletar o serviço. Por favor, tente novamente.` }
  }
}