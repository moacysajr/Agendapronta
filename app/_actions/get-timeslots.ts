"use server"
import { db } from "../_lib/prisma";

export async function getAllTimeSlots(barbershopId: string) {
  return db.timeSlot.findMany({
    where: {
      barbershopId,
    },
    orderBy: {
      time: 'asc',
    },
  })
}