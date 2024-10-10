import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { redirect } from "next/navigation"
import { salute } from "../_lib/salute"
import { getTodayBookings } from "../_actions/get-today-bookings"
import { Separator } from "../_components/ui/separator"
import { Button } from "../_components/ui/button"
import Link from "next/link"
import { TimeSlotManager } from "../_components/adminComponents/TimeSlotsTable"
import { db } from "../_lib/prisma"
import { UpdateBarbershopInfosForm } from "../_components/adminComponents/forms/UpdateBarbershopInfos"
import { Booking } from "@/app/_types/schema"

const Admin = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (!session?.user.isAdmin) {
    redirect("/")
  }

  const allBookings = await getTodayBookings()
  const horaatual = new Date()
  const agendamentoativo = allBookings.filter((booking: Booking) => {
    const bookingTime = new Date(booking.date)
    return bookingTime > horaatual
  })
 const barbershop = await db.barbershop.findFirst()
  return (
    <section>
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {salute() + `, ${session.user.name?.split(" ")[0]}!`}
        </h1>
        {agendamentoativo.length === 0 ? (
          <p className="mt-2 text-lg text-gray-400">
            Você não tem atendimentos hoje.
          </p>
        ) : agendamentoativo.length === 1 ? (
          <p className="mt-2 text-lg text-gray-400">
            Você tem um atendimento hoje.
          </p>
        ) : (
          <p className="mt-2 text-lg text-gray-400">
            Você ainda tem {agendamentoativo.length} atendimentos hoje.
          </p>
        )}
        <Button asChild>
          <Link href={"/admin/bookings"}>Ver atendimentos</Link>
        </Button>
      </div>
      <Separator className="my-5" />
      <h1 className="mb-5 scroll-m-20 text-xl font-semibold tracking-tight">
        Alterar configurações da barbearia:
      </h1>
      {barbershop ? (
        <UpdateBarbershopInfosForm barbershop={barbershop} />
      ) : (
        "Ocorreu um erro"
      )}

      <Separator className="my-5" />
      <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Gerenciar horário de funcionamento
      </h1>
      <TimeSlotManager barbershopId={barbershop?.id!} />
    </section>
  )
}

export default Admin
