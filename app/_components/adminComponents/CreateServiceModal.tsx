import { FC } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import CreateServiceForm from "./forms/CreateServiceForm"

interface CreateServiceModalProps {
  barberShopId: string | undefined
}

const CreateServiceModal: FC<CreateServiceModalProps> = ({ barberShopId }) => {
  if (barberShopId) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo serviço</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para criar um novo serviço.
          </DialogDescription>
          <CreateServiceForm barberShopId={barberShopId} />
        </DialogHeader>
      </DialogContent>
    )
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Algo deu errado...</DialogTitle>
        <DialogDescription>
          Não foi possível identificar sua barbearia... Entre em contato com o
          suporte.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}

export default CreateServiceModal
