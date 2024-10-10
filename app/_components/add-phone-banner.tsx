"use client"
import { Loader2, X } from "lucide-react"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"

import { cn } from "../_lib/utils"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { toast } from "sonner"
import { UpdatePhone } from "../_actions/update-phone"

interface PhoneBannerParams {
  userId: string
}
interface PhoneBannerFormParams {
  userId: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const AddPhoneBanner: FC<PhoneBannerParams> = ({ userId }) => {
  // TODO: corrigir o banner ainda aparecer mesmo o user deslogado
  const [IsOpen, setIsOpen] = useState(true)
  return (
    <div
      className={cn(
        IsOpen
          ? "relative flex items-center justify-center gap-2 bg-secondary px-2 py-3 text-secondary-foreground"
          : "hidden",
      )}
    >
      <p className="text-sm">
        Adicione seu contato para receber notificações sobre o atendimento!
      </p>
      <AddPhoneDialog userId={userId} setIsOpen={setIsOpen} />
      <Button
        variant={"ghost"}
        size={"sm"}
        className="absolute right-5"
        onClick={() => setIsOpen(false)}
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}

export default AddPhoneBanner

const formSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "(O campo é obrigatório)" })
    .regex(/^(\+55|0)?(\d{2})?\d{9}$/, {
      message: "Formato de telefone inválido",
    })
    .transform((val) => {
      // Remove non-digit characters
      const digits = val.replace(/\D/g, "")

      // Ensure the number has 11 digits (including area code)
      if (digits.length === 11) {
        return digits
      } else if (digits.length === 13 && digits.startsWith("55")) {
        return digits.slice(2)
      } else {
        return val // Return original value if it doesn't match expected formats
      }
    })
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "")
        return digits.length === 11 && digits[2] === "9"
      },
      { message: "Para enviar adicione o 9 após o DDD" },
    ),
})

const AddPhoneDialog: FC<PhoneBannerFormParams> = ({ userId, setIsOpen }) => {
  const [IsSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await UpdatePhone(userId, values.phone)
      toast.success("Atualizado!")
      setIsDialogOpen(false)
      setIsOpen(false)
    } catch (error) {
      toast.error("Ocorreu um erro ao atualizar seu contato, tente novamente.")
      setIsDialogOpen(false)
      setIsOpen(false)
    }
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"} className="text-sm" type="button">
          Adicionar contato
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar contato</DialogTitle>
          <DialogDescription>
            Use um telefone que tenha cadastrado whatsapp, por meio dele você
            receberá atualizações sobre a sua reserva.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="99 9 99999999" {...field} />
                  </FormControl>
                  <FormDescription>
                    Digite o telefone (Somente números).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={IsSubmitting}>
                {IsSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>Salvar contato</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
