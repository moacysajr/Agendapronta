"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { sendMessage } from "./send-message"
export async function cancelBooking(bookingId: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: { select: { phone: true } },
      service: true,
    },
  })

  if (!booking) {
    throw new Error('Agendamento não encontrado')
  }

  await db.booking.delete({
    where: { id: bookingId },
  })

  const userPhone = booking.user?.phone
  const mensagem = `Seu agendamento para o serviço ${booking.service.name} foi cancelado entre em contato para mais informações .`

  try {
    if (userPhone) {
      await sendMessage(userPhone, mensagem)
      console.log(`Mensagem enviada para o telefone ${userPhone}`)
    } else {
      console.warn("O usuário não possui um telefone registrado.")
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem de cancelamento:", error)
  }

  revalidatePath("/bookings")
  revalidatePath("/admin")
  revalidatePath("/admin/bookings")
}