"use client"
import { FC, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "../../ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { UploadButton } from "@/app/_lib/uploadthing"
import { createService } from "@/app/_actions/create-service"
import { toast } from "sonner"

interface CreateServiceFormProps {
  barberShopId: string
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
  imageUrl: z.string().min(1, { message: "Imagem é obrigatória" }),
  price: z
    .number()
    .positive("O preço deve ser positivo")
    .multipleOf(0.01, "O preço deve ter no máximo 2 casas decimais")
    .min(1, { message: "O serviço deve ter um preço" }),
})

const CreateServiceForm: FC<CreateServiceFormProps> = ({ barberShopId }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, description, imageUrl, price } = values
    try {
      await createService({
        name,
        description,
        imageUrl,
        price: price,
        barbershopId: barberShopId,
      })
      toast.success("Novo serviço criado.")
    } catch (error) {
      toast.error(`Erro ao criar serviço: ${error}`)
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
        // Você pode adicionar uma notificação de erro aqui
      }
    }
  }

  return (
   
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Corte navalhado" {...field} required />
              </FormControl>
              <FormDescription>
                Nome que vai aparecer para o cliente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Corte de cabelo com linhas precisas, criado com navalha para definição."
                  {...field}
                  required
                />
              </FormControl>
              <FormDescription>Descrição breve do serviço.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="15.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    required
                  />
                </FormControl>
                <FormDescription>Preço do serviço.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
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
        </div>

        <Button className="w-full sm:w-auto" type="submit">
          Criar novo serviço
        </Button>
      </form>
    </Form>
  )
}

export default CreateServiceForm
