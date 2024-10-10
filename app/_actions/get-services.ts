"use server"
import { db } from "../_lib/prisma"

export const getServices = () => {
  return db.barbershopService.findMany()
}