import ServiceItem from "@/app/_components/service-item"
import SidebarSheet from "@/app/_components/sidebar-sheet"
import { Button } from "@/app/_components/ui/button"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import { db } from "@/app/_lib/prisma"
import { MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { FaWhatsapp } from "react-icons/fa"
import CheckUserPhone from "./_components/check-user-phone"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"

const BarbershopPage = async () => {
  const user = await getServerSession(authOptions)
  const barbershop = await db.barbershop.findFirst({
    include: {
      services: true,
    },
  })

  if (!barbershop) {
    return notFound()
  }

  return (
    <div>
      {user && <CheckUserPhone />}

      {/* IMAGEM */}
      <div className="relative h-[250px] w-full">
        <Image
          alt={barbershop.name}
          src={barbershop?.imageUrl}
          fill
          className="object-cover"
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-4 top-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </div>

      {/* TÍTULO */}
      <div className="border-b border-solid p-5">
        <div className="mb-3 inline-flex gap-2">
          <h1 className="text-xl font-bold">{barbershop.name}</h1>
          {barbershop.isClosed ? (
            <div className="inline-flex items-center gap-1 text-sm font-light">
              <div className="size-2 animate-pulse rounded-full bg-red-500" />
              <span>Fechado</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-sm font-light">
              <div className="size-2 animate-pulse rounded-full bg-green-500" />
              <span>Online</span>
            </div>
          )}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop?.address}</p>
        </div>

        <div className="flex items-center gap-2">
          <StarIcon className="fill-primary text-primary" size={18} />
          <p className="text-sm">5,0 </p>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-2 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Sobre nós</h2>
        <p className="text-justify text-sm">{barbershop?.description}</p>
      </div>

      {/* SERVIÇOS */}
      <div className="border-b border-solid p-5">
        <h2 className="mb-4 text-xs font-bold uppercase text-gray-400">
          Serviços
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {barbershop.services.map((service) => (
            <ServiceItem
              key={service.id}
              barbershop={JSON.parse(JSON.stringify(barbershop))}
              service={JSON.parse(JSON.stringify(service))}
              isClosed={barbershop.isClosed}
            />
          ))}
        </div>
      </div>

      {/* CONTATO */}
      <div className="space-y-3 p-5">
        <h2 className="mb-4 text-xs font-bold uppercase text-gray-400">
          Contato
        </h2>
        <div className="flex flex-wrap gap-4">
          {barbershop.phones.map((phone) => (
            <Button asChild key={phone} variant={"outline"}>
              <a
                href={`https://wa.me/${phone.toString()}?text= Gostaria de mais informações!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <FaWhatsapp className="h-5 w-5 text-green-500" />
                <span>Entrar em contato</span>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarbershopPage
