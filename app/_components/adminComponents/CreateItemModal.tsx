import { FC } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import CreateItemForm from "./forms/CreateItemForm"

interface CreateItemModalProps {
  barberShopId: string | undefined
}

const CreateItemModal: FC<CreateItemModalProps> = ({ barberShopId }) => {
  if (barberShopId) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo item</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para criar um novo item.
          </DialogDescription>
          <CreateItemForm barberShopId={barberShopId} />
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

export default CreateItemModal
