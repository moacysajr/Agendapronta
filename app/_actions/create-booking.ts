"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { sendMessage } from "./send-message"

interface CreateBookingParams {
  serviceId: string
  date: Date
}
// aqui eu não mexi em nada  da função apenas chamei a função la em baixo da menssagem e dei os selects ali
export const createBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions)
  if (!user) {
    throw new Error("Usuário não autenticado")
  }
  await db.booking.create({
    data: { ...params, userId: (user.user as any).id },
  })
  // aqui os selects
  const service = await db.barbershopService.findUnique({
    where: { id: params.serviceId },
    select: {
      name: true,
      barbershop: {
        select: {
          phones: true,
        },
      },
    },
  })
  //segundo meus mano da ia falaram que pra eu conseguir cirar meu agendamendo primerio sem que a messagem atrapalhe eu preciso encapsular ele,
  //então por isso a criação do sendNotifications
  const sendNotification = async () => {
    //verificas e tem o celular do barber(que vai ter semrpeo vou tirar isso aqui depoois )
    if (service?.barbershop?.phones && service.barbershop.phones.length > 0) {
      //aqui papai ta pegado só o numero do barbeiro
      const telefonebarbeiro = service.barbershop.phones[0]
      const mensagem = `Um novo agendamento foi criado para o serviço ${service.name} no dia ${params.date.toLocaleDateString("pt-BR")}.`

      await sendMessage(telefonebarbeiro, mensagem)
      console.log(`Mensagem enviada para o telefone ${telefonebarbeiro}`)
    } else {
      console.warn(
        "Nenhum telefone encontrado para a barbearia associada ao serviço",
      )
    }
  }

  sendNotification()

  revalidatePath("/")
  revalidatePath("/bookings")
  revalidatePath("/admin")
  revalidatePath("/admin/bookings")
}
