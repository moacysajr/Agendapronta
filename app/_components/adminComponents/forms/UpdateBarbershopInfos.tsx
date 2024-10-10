"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Input } from "../../ui/input"
import { updateBarbershop } from "@/app/_actions/update-barbershop-infos"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"
import { Textarea } from "../../ui/textarea"
import { Switch } from "../../ui/switch"
import { Button } from "../../ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Digite pelo menos 3 caracteres.",
  }),
  address: z.string().min(5, {
    message: "Endereços devem ter pelo menos 5 caracteres.",
  }),
  phones: z.array(
    z.string().regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Formato de número inválido.",
    }),
  ),
  isClosed: z.boolean(),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  imageUrl: z.string().url({
    message: "Formato de URL inválido.",
  }),
})

//@ts-ignore
export function UpdateBarbershopInfosForm({ barbershop }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: barbershop.name,
      address: barbershop.address,
      phones: barbershop.phones,
      isClosed: barbershop.isClosed,
      description: barbershop.description,
      imageUrl: barbershop.imageUrl,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const result = await updateBarbershop(barbershop.id, values)
    if (result.success) {
      // Handle success (e.g., show a success message)
      toast.success("Informações atualizadas com sucesso!")
      setIsLoading(false)
    } else {
      // Handle error (e.g., show an error message)
      console.error("Ocorreu um erro ao atualizar as informações da barbearia.")
      toast.error("Ops! Algo deu errado.")
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da barbearia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço da barbearia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Telefone(s) (separe com vírgulas)"
                  {...field}
                  value={field.value.join(", ")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Digite os números de telefone separados por vírgulas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isClosed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Fechado</FormLabel>
                <FormDescription>A barbearia está fechada?</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
                <Textarea placeholder="Descrição da barbearia" {...field} />
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
              <FormLabel>Banner</FormLabel>
              <FormControl>
                <Input
                  placeholder="Url da imagem do banner"
                  // TODO:GIL Lógica de upload da imagem
                  disabled
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-5 animate-spin" /> {"Salvando..."}
            </>
          ) : (
            "Salvar informações"
          )}
        </Button>
      </form>
    </Form>
  )
}
