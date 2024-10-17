"use client"
import {
  ArrowLeftFromLine,
  Calendar,
  Home,
  LineChart,
  Scissors,
  Users2,
  PackageCheck,
  ArchiveRestore,
} from "lucide-react"
import Link from "next/link"
import { FC } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { usePathname } from "next/navigation"
import { cn } from "@/app/_lib/utils"
interface AsideMenuProps {}

const AsideMenu: FC<AsideMenuProps> = ({}) => {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <ArrowLeftFromLine className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Página Inicial</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                pathname === "/admin"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/bookings"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                pathname === "/admin/bookings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Calendar className="h-5 w-5" />
              <span className="sr-only">Agendamentos</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Agendamentos</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/services"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                pathname === "/admin/services"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Scissors className="h-5 w-5" />
              <span className="sr-only">Serviços</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Serviços</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/clients"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                pathname === "/admin/clients"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Users2 className="h-5 w-5" />
              <span className="sr-only">Clientes</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Clientes</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/analytics"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                pathname === "/admin/analytics"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <LineChart className="h-5 w-5" />
              <span className="sr-only">Analytics</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Analytics</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/item"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                pathname === "/admin/item"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <ArchiveRestore className="h-5 w-5" />
              <span className="sr-only">Item</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Item</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin/finish"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                pathname === "/admin/finish"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <PackageCheck className="h-5 w-5" />
              <span className="sr-only">Concluir Pedido</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Concluir Pedido</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  )
}

export default AsideMenu
