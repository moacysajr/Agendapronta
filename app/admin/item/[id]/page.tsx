import { FC } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { notFound, redirect } from "next/navigation"
import UpdateItemForm from "@/app/_components/adminComponents/forms/UpdateItemForm" // Ajuste para o formulário de item
import { Separator } from "@/app/_components/ui/separator"

interface UpdateItemPageProps {
  params: {
    id: string
  }
}

const UpdateItemPage: FC<UpdateItemPageProps> = async ({ params }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (!session?.user.isAdmin) {
    redirect("/")
  }

  // Busca o item baseado no id passado nos parâmetros
  const item = await db.item.findUnique({
    where: {
      id: params.id,
    },
    include: {
      barbershop: true,
    },
  })

  if (!item) {
    notFound()
  }

  const itemForClient = {
    ...item,
    price: item.price.toNumber(), // Converte Decimal para number
    description: item.description ?? "", // Garante que description não será null
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">Atualizar Item - {item.name}</h1>
      <Separator className="my-5" />
      <UpdateItemForm initialItem={itemForClient} />{" "}
      {/* Ajuste para o formulário de item */}
    </div>
  )
}

export default UpdateItemPage
