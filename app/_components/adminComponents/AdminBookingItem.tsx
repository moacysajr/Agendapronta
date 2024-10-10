"use client"
import { FC } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import CancelBookingButton from "../CancelBookingButton"

interface BookingItemProps {
  booking: any // Ajuste o tipo conforme necessário
}

const AdminBookingItem: FC<BookingItemProps> = ({ booking }) => {
  return (
    <div className="flex cursor-pointer justify-between rounded-lg border p-4">
      {/* ESQUERDA */}
      <div className="flex flex-col gap-2">
        <p>
          <strong>Cliente:</strong> {booking.user.name}
        </p>
        <p>
          <strong>Serviço:</strong> {booking.service.name}
        </p>
        <CancelBookingButton bookingId={booking.id} />
      </div>

      {/* DIREITA */}
      <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
        <p className="text-sm capitalize">
          {format(new Date(booking.date), "MMMM", { locale: ptBR })}
        </p>
        <p className="text-2xl">
          {format(new Date(booking.date), "dd", { locale: ptBR })}
        </p>
        <p className="text-sm">
          {format(new Date(booking.date), "HH:mm", { locale: ptBR })}
        </p>
      </div>
    </div>
  )
}

export default AdminBookingItem
