// components/CancelBookingButton.tsx
"use client"

import { FC, useState } from "react"
import { Button } from "@/app/_components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"

import { toast } from "sonner"
import { cancelBooking } from "../_actions/cancel-booking"
import { Loader2, Trash2 } from "lucide-react"

interface CancelBookingButtonProps {
  bookingId: string
}

const CancelBookingButton: FC<CancelBookingButtonProps> = ({ bookingId }) => {
  const [IsLoading, setIsLoading] = useState(false)
  const handleCancelBooking = async () => {
    setIsLoading(true)
    try {
      await cancelBooking(bookingId)
      setIsLoading(false)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error)
      setIsLoading(false)
      toast.error("Erro ao cancelar reserva. Tente novamente.")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {IsLoading ? <Loader2 className="animate-spin" /> : <Trash2 />}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%]">
        <DialogHeader>
          <DialogTitle>
            Você deseja cancelar a reserva deste cliente?
          </DialogTitle>
          <DialogDescription>Quer mesmo cancelar?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-3">
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              Voltar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              className="w-full"
            >
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CancelBookingButton
