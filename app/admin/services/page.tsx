import { getServices } from "@/app/_actions/get-services"
import CreateServiceModal from "@/app/_components/adminComponents/CreateServiceModal"
import EditService from "@/app/_components/adminComponents/EditService"
import { Button } from "@/app/_components/ui/button"
import { Dialog, DialogTrigger } from "@/app/_components/ui/dialog"
import { Separator } from "@/app/_components/ui/separator"
import { authOptions } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { BarbershopService } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { Plus } from "lucide-react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { FC } from "react"

type ServiceWithNumberPrice = Omit<BarbershopService, "price"> & {
  price: number
}

const convertDecimalToNumber = (decimal: Decimal | number): number => {
  if (decimal instanceof Decimal) {
    return decimal.toNumber()
  }
  return decimal as number
}

const page: FC = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (!session?.user.isAdmin) {
    redirect("/")
  }

  const allServices = await getServices()
  const barberShop = await db.barbershop.findFirst({ select: { id: true } })

  const servicesWithNumberPrice: ServiceWithNumberPrice[] = allServices.map(
    (service) => ({
      ...service,
      price: convertDecimalToNumber(service.price),
    }),
  )

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Serviços oferecidos:
        </h1>
        <Dialog>
          <Button asChild>
            <DialogTrigger>
              <Plus className="mr-2 h-5 w-5" />
              Adicionar novo
            </DialogTrigger>
          </Button>
          <CreateServiceModal barberShopId={barberShop?.id!} />
        </Dialog>
      </div>
      <Separator className="my-5" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
        {servicesWithNumberPrice.map((service) => (
          <EditService key={service.id} service={service} />
        ))}
      </div>
    </section>
  )
}

export default page
