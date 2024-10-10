"use server"
import { db } from "../_lib/prisma"

export const getClients = () => {
  return db.user.findMany()
}
