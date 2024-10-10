import { FC } from "react"
import { getTodayBookings } from "@/app/_actions/get-today-bookings"
import { Separator } from "@/app/_components/ui/separator"
import RevalidateButton from "@/app/_components/RivalidateButton"
import { Booking } from "@/app/_types/schema"
import AdminBookingItem from "@/app/_components/adminComponents/AdminBookingItem"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"

const Page: FC = async () => {
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

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="mt-3 scroll-m-20 text-xl font-semibold tracking-tight">
          Agendamentos de hoje:
        </h1>
        <RevalidateButton />
      </div>
      <Separator className="my-5" />
      {agendamentoativo.length === 0 ? (
        <p className="text-gray-400">Você não tem agendamentos hoje.</p>
      ) : (
        <div className="space-y-5">
          {agendamentoativo.map((booking: Booking) => (
            <AdminBookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Page
