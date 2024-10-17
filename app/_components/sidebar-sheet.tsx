"use client"

import { FC, useState } from "react"
import { Button } from "./ui/button"
import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  Shield,
  ShoppingCart, 
} from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarImage } from "./ui/avatar"
import SignInDialog from "./sign-in-dialog"
import { Separator } from "./ui/separator"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ModeToggle } from "./ModeToggle"

const SidebarSheet: FC = () => {
  const { data } = useSession()
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)
  const router = useRouter()

  const handleLogoutClick = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Você foi deslogado com sucesso!")
    } catch (error) {
      toast.error("Erro ao deslogar!")
    }
  }

  const handleBookingsClick = () => {
    if (!data?.user) {
      setIsSignInDialogOpen(true)
    } else {
      router.push("/bookings") // Redireciona para a página de agendamentos se o usuário estiver logado
    }
  }

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={data?.user?.image ?? ""} />
            </Avatar>

            <div>
              <p className="font-bold">{data.user.name}</p>
              <p className="text-xs">{data.user.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-bold">Olá, faça seu login!</h2>
            <Dialog
              open={isSignInDialogOpen}
              onOpenChange={setIsSignInDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="icon">
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%]">
                <SignInDialog />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>
        <Button
          className="justify-start gap-2"
          variant="ghost"
          onClick={handleBookingsClick}
        >
          <CalendarIcon size={18} />
          Agendamentos
        </Button>
        {data?.user.isAdmin && (
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/admin">
              <Shield size={18} />
              Administrador
            </Link>
          </Button>
        )}

        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/item">
              <ShoppingCart size={18} />
              Produtos
            </Link>
          </Button>
        </SheetClose>

        <ModeToggle />


      </div>
      <Separator />
      {data?.user && (
        <div className="flex flex-col gap-2 py-5">
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  )
}

export default SidebarSheet
