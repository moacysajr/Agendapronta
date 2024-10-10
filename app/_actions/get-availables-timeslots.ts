"use server"
import { db } from "../_lib/prisma";

export async function getAvailableTimeSlots() {
  const babershop = await db.barbershop.findFirst()
  return db.timeSlot.findMany({
    where: {
      barbershopId: babershop?.id,
      isAvailable: true,
    },
    orderBy: {
      time: 'asc',
    },
  })
}