"use server"

import { makeAdmin } from "./make-admin"
import { removeAdmin } from "./remove-admin"

export async function makeAdminAction(userId: string) {
  try {
    await makeAdmin({ userId })
    return { success: true, message: "Usuário promovido a administrador com sucesso!" }
  } catch (error) {
    return { success: false, message: "Erro ao promover usuário a administrador. Tente novamente." }
  }
}

export async function removeAdminAction(userId: string) {
  try {
    await removeAdmin({ userId })
    return { success: true, message: "Status de administrador removido com sucesso!" }
  } catch (error) {
    return { success: false, message: "Erro ao remover status de administrador. Tente novamente." }
  }
}