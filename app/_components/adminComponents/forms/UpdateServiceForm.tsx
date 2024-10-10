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
import { updateService } from "@/app/_actions/update-service"

const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
  imageUrl: z.string().min(1, { message: "Imagem é obrigatória" }),
  price: z
    .number()
    .positive("O preço deve ser positivo")
    .multipleOf(0.01, "O preço deve ter no máximo 2 casas decimais"),
})

type ServiceSchema = z.infer<typeof serviceSchema>

interface UpdateServiceFormProps {
  initialService: {
    id: string
    name: string
    description: string
    imageUrl: string
    price: number
    barbershopId: string
  }
}

const UpdateServiceForm: FC<UpdateServiceFormProps> = ({ initialService }) => {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialService.imageUrl,
  )

  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      ...initialService,
      price: Number(initialService.price),
    },
  })

  async function onSubmit(values: ServiceSchema) {
    try {
      await updateService(values)
      toast.success("Serviço atualizado com sucesso.")
      router.push(`/admin/services`)
    } catch (error) {
      toast.error(`Erro ao atualizar serviço: ${error}`)
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
          throw new Error("Failed to delete image")
        }

        setImageUrl(null)
        form.setValue("imageUrl", "")
      } catch (error) {
        console.error("Error deleting image:", error)
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
            onClick={() => router.push("/admin/services")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdateServiceForm
