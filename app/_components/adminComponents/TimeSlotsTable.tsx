"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import {
  checkScheduledServices,
  deleteTimeSlot,
  updateTimeSlotAvailability,
  addTimeSlot,
  getAllTimeSlots,
} from "@/app/_actions/timeSlotActions"
import { Loader2 } from "lucide-react"

type TimeSlot = {
  id: string
  time: string
  isAvailable: boolean
}

export function TimeSlotManager({ barbershopId }: { barbershopId: string }) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [newTime, setNewTime] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scheduledServices, setScheduledServices] = useState<string[]>([])
  const [DeletingTimeSlotId, setDeletingTimeSlotId] = useState("")

  useEffect(() => {
    fetchTimeSlots()
  }, [])

  async function fetchTimeSlots() {
    const slots = await getAllTimeSlots(barbershopId)
    setTimeSlots(slots)
  }

  async function handleDeleteTimeSlot(id: string) {
    setDeletingTimeSlotId(id)
    const services = await checkScheduledServices(id)
    if (services.length === 0) {
      await deleteTimeSlot(id)
      fetchTimeSlots()
    } else {
      setScheduledServices(services)
      setDeleteDialogOpen(true)
    }
    setDeletingTimeSlotId("")
  }

  async function handleUpdateTimeSlotAvailability(
    id: string,
    isAvailable: boolean,
  ) {
    await updateTimeSlotAvailability(id, isAvailable)
    fetchTimeSlots()
  }

  async function handleAddTimeSlot() {
    await addTimeSlot(barbershopId, newTime)
    setNewTime("")
    fetchTimeSlots()
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Horário</TableHead>
            <TableHead>Disponível</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSlots.map((slot) => (
            <TableRow key={slot.id}>
              <TableCell>{slot.time}</TableCell>
              <TableCell>
                <Switch
                  checked={slot.isAvailable}
                  onCheckedChange={(checked: boolean) =>
                    handleUpdateTimeSlotAvailability(slot.id, checked)
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  disabled={DeletingTimeSlotId != ""}
                  onClick={() => handleDeleteTimeSlot(slot.id)}
                >
                  {DeletingTimeSlotId === slot.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Deletar"
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Adicionar Novo Horário</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Horário</DialogTitle>
          </DialogHeader>
          <Input
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="HH:MM"
          />
          <Button onClick={handleAddTimeSlot}>Adicionar</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Não é possível deletar este horário</DialogTitle>
          </DialogHeader>
          <div>
            <p>Existem serviços agendados para este horário:</p>
            <ul>
              {scheduledServices.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
            <p>
              Por favor, cancele os serviços manualmente antes de deletar o
              horário.
            </p>
          </div>
          <Button onClick={() => setDeleteDialogOpen(false)}>Fechar</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
