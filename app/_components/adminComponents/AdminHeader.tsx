"use client"
import { FC } from "react"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import {
  ArrowLeftFromLine,
  Calendar,
  Home,
  LineChart,
  PackageCheck,
  ArchiveRestore,
  PanelLeft,
  Scissors,
  Users2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/_lib/utils"

interface AdminHeaderProps {}

const AdminHeader: FC<AdminHeaderProps> = ({}) => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Alternar menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <ArrowLeftFromLine className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Página Inicial</span>
            </Link>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-4 px-2.5",
                pathname === "/admin"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Home className="h-5 w-5" />
              
              Pagina Inicial
            </Link>
            <Link
              href="/admin/bookings"
              className={cn(
                "flex items-center gap-4 px-2.5",
                pathname === "/admin/bookings"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Calendar className="h-5 w-5" />
              Agendamentos
            </Link>
            <Link
              href="/admin/services"
              className={cn(
                "flex items-center gap-4 px-2.5",
                pathname === "/admin/services"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Scissors className="h-5 w-5" />
              Serviços
            </Link>
            <Link
              href="/admin/clients"
              className={cn(
                "flex items-center gap-4 px-2.5",
                pathname === "/admin/clients"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Users2 className="h-5 w-5" />
              Clientes
            </Link>
            <Link
              href="/admin/analytics"
              className={cn(
                "flex items-center gap-4 px-2.5",
                pathname === "/admin/analytics"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LineChart className="h-5 w-5" />
              Analytics
            </Link>
            <Link
              href="/admin/item"
              className={cn(
                "flex items-center gap-4 px-2.5",
                pathname === "/admin/bookings"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ArchiveRestore className="h-5 w-5" />
              Item
            </Link>

            <Link
              href="/admin/finish"
              className={cn(
                "flex items-center gap-4 px-2.5",
                pathname === "/admin/bookings"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <PackageCheck className="h-5 w-5" />
              Concluir Pedido
            </Link>


          </nav>
        </SheetContent>
      </Sheet>

      
    </header>
  )
}

export default AdminHeader
