"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { sendMessage } from "./send-message"

export const deleteBooking = async (bookingId: string) => {
  const bookingInfo = await db.booking.findUnique({
    where: {
      id: bookingId,
    },
    select: {
      date: true,
      service: {
        select: {
          name: true,
          barbershop: {
            select: {
              phones: true,
            },
          },
        },
      },
    },
  })

  if (!bookingInfo) {
    throw new Error("Agendamento não encontrado")
  }

  // 👍💣
  const mensagem = `Um agendamento para o serviço ${bookingInfo.service.name} no dia ${bookingInfo.date.toLocaleDateString("pt-BR")} foi cancelado.`

  // pegando o primerio celulardo do barveiro la
  const telefoneBarbeiro = bookingInfo.service.barbershop.phones[0]

  try {
    // aqui a gnte ta deletando o agendamento
    await db.booking.delete({
      where: {
        id: bookingId,
      },
    })

    // Tentado enviar a mensagem pro barbeiro
    await sendMessage(telefoneBarbeiro, mensagem)
    console.log(`Mensagem de cancelamento enviada para ${telefoneBarbeiro}`)
  } catch (error) {
    // TODO: fazer toast de acordo se a mensagem foi realmente enviada ou não
    console.error("Erro ao cancelar agendamento ou enviar mensagem:", error)
  }

  revalidatePath("/bookings")
  revalidatePath("/admin")
  revalidatePath("/admin/bookings")
}
