"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  return process.env.NODE_ENV === 'production'
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000'
}

export const sendMessage = async (phoneNumber: string, message: string) => {
  const EVOLUTIONTOKEN = process.env.EVOLUTIONTOKEN;
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    console.error("Tentativa de envio de mensagem sem autenticação")
    throw new Error("Usuário não autenticado")
  }

  const baseUrl = getBaseUrl()
  console.warn("BASE_URL: ", baseUrl)
  // TODO: modificar para puxar o localhost
  const url = `https://barber-mg-v2.vercel.app/api/sendMessage?number=${phoneNumber}&text=${message}`
  console.warn("A mensagem está sendo enviada em:", url)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTIONTOKEN!
      }
    })

    const data = await response.json()
    console.log("Mensagem enviada com sucesso:", data)
    return data

  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao enviar mensagem:", error.message)
    } else {
      console.error("Erro desconhecido ao enviar mensagem:", error)
    }
    throw error 
  }
}