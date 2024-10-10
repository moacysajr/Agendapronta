import { FC } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"

import { notFound, redirect } from "next/navigation"
import UpdateServiceForm from "@/app/_components/adminComponents/forms/UpdateServiceForm"
import { Separator } from "@/app/_components/ui/separator"

interface UpdateServicePageProps {
  params: {
    id: string
  }
}

const UpdateServicePage: FC<UpdateServicePageProps> = async ({ params }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (!session?.user.isAdmin) {
    redirect("/")
  }

  const service = await db.barbershopService.findUnique({
    where: {
      id: params.id,
    },
    include: {
      barbershop: true,
    },
  })

  if (!service) {
    notFound()
  }

  const serviceForClient = {
    ...service,
    price: service.price.toNumber(), // Converte Decimal para number
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">
        Atualizar Serviço - {service.name}
      </h1>
      <Separator className="my-5" />
      <UpdateServiceForm initialService={serviceForClient} />
    </div>
  )
}

export default UpdateServicePage
