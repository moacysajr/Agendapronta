"use client"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { useRouter } from "next/navigation"
import { Button } from "../../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { UploadButton } from "@/app/_lib/uploadthing"
import { toast } from "sonner"
import { updateItem } from "@/app/_actions/update-item"

const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
  imageUrl: z.string().min(1, { message: "Imagem é obrigatória" }),
  price: z
    .number()
    .positive("O preço deve ser positivo")
    .multipleOf(0.01, "O preço deve ter no máximo 2 casas decimais"),
})

type ItemSchema = z.infer<typeof itemSchema>

interface UpdateItemFormProps {
  initialItem: {
    id: string
    name: string
    description: string | null
    imageUrl: string
    price: number
    barbershopId: string
  }
}

const UpdateItemForm: FC<UpdateItemFormProps> = ({ initialItem }) => {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string | null>(initialItem.imageUrl)

  const form = useForm<ItemSchema>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      id: initialItem.id,
      name: initialItem.name,
      description: initialItem.description || "",
      imageUrl: initialItem.imageUrl,
      price: Number(initialItem.price),
    },
  })

  async function onSubmit(values: ItemSchema) {
    try {
      await updateItem(values)
      toast.success("Item atualizado com sucesso.")
      router.push(`/admin/item`)
    } catch (error) {
      toast.error(`Erro ao atualizar item: ${error}`)
    }
  }

  const handleRemoveImage = async () => {
    if (imageUrl) {
      try {
        const response = await fetch("/api/uploadthing/delete-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        })

        if (!response.ok) {
          throw new Error("Falha ao deletar a imagem")
        }

        setImageUrl(null)
        form.setValue("imageUrl", "")
      } catch (error) {
        console.error("Erro ao deletar a imagem:", error)
        toast.error("Erro ao remover imagem")
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                {!imageUrl ? (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setImageUrl(res[0].url)
                        field.onChange(res[0].url)
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error(error)
                      toast.error("Erro ao fazer upload da imagem")
                    }}
                  />
                ) : (
                  <div className="space-y-2">
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="mt-2 h-32 w-32 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemoveImage}
                    >
                      Remover Imagem
                    </Button>
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 sm:justify-end">
          <Button type="submit">Salvar alterações</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/item")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdateItemForm
