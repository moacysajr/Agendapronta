"use client"
import { BarbershopService, Prisma } from "@prisma/client"
import { Card, CardContent } from "../ui/card"
import Image from "next/image"
import { Button } from "../ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { deleteService } from "@/app/_actions/delete-service"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Decimal } from "@prisma/client/runtime/library"

type BarbershopServiceWithFlexiblePrice = Omit<BarbershopService, "price"> & {
  price: Decimal | Prisma.Decimal | number
}
interface BarbershopItemProps {
  service: BarbershopServiceWithFlexiblePrice
}

const EditService = ({ service }: BarbershopItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.append("id", service.id)
      const result = await deleteService(formData)

      if (result.success) {
        toast.success(result.message)
        // Aqui você pode adicionar lógica para atualizar a UI ou redirecionar
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar deletar o serviço")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatPrice = (price: Decimal | Prisma.Decimal | number): string => {
    if (typeof price === "number") {
      return price.toFixed(2)
    }
    return price.toNumber().toFixed(2)
  }

  return (
    <Card className="min-w-[167px] rounded-2xl">
      <CardContent className="p-0 px-1 pt-1">
        {/* IMAGEM */}
        <div className="relative h-[159px] w-full">
          <Image
            alt={service.name}
            fill
            className="rounded-2xl object-cover"
            src={service.imageUrl}
          />
        </div>

        {/* TEXTO */}
        <div className="px-1 py-3">
          <h3 className="truncate font-semibold">{service.name}</h3>
          <p className="truncate text-sm text-gray-400">
            {service.description}
          </p>
          <p className="truncate text-sm font-bold text-gray-100">
            R${formatPrice(service.price)}
          </p>
          <div className="mt-3 flex gap-2 flex-row md:flex-col lg:flex-row">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/admin/services/${service.id}`}>Editar serviço</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"ghost"} className="flex-1 text-destructive">
                  Deletar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente o serviço: {service.name}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <Button variant={"destructive"} asChild>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {!isDeleting ? (
                        "Deletar"
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </AlertDialogAction>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EditService
