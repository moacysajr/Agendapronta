"use server"
import { db } from "../_lib/prisma"

export const getItems = () => {
  return db.item.findMany()
}
