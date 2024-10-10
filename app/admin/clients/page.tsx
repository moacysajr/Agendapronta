import { getClients } from "@/app/_actions/get-clients"
import {
  makeAdminAction,
  removeAdminAction,
} from "@/app/_actions/permissions-actions"
import EditAdminClient from "@/app/_components/adminComponents/EditAdminClient"

import { Badge } from "@/app/_components/ui/badge"
import { Separator } from "@/app/_components/ui/separator"
import { authOptions } from "@/app/_lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (!session?.user.isAdmin) {
    redirect("/")
  }

  const allClients = await getClients()

  return (
    <section>
      <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Sua cartela de clientes:
      </h1>
      <Separator className="my-5" />
      <div className="space-y-2">
        {allClients.map((client) => (
          <div key={client.id} className="rounded-lg border p-5">
            <h3 className="flex items-center gap-2 text-lg">
              {client.name} {client.isAdmin && <Badge>Admin</Badge>}
            </h3>
            <div className="flex grow-0 flex-col flex-nowrap gap-1">
              <span>Email: {client.email}</span>
              <span>Telefone: {client.phone}</span>
              <EditAdminClient
                isAdmin={client.isAdmin}
                userId={client.id}
                makeAdminAction={makeAdminAction}
                removeAdminAction={removeAdminAction}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
