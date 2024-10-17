import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const { concluded } = await request.json()

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { concluded },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar o pedido' }, { status: 500 })
  }
}