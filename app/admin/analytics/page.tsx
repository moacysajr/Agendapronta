import FaturamentoMes from "@/app/_components/analytics-charts/faturamento-mes"
import FaturamentoSemana from "@/app/_components/analytics-charts/faturamento-semana"
import MediaAtendimentos from "@/app/_components/analytics-charts/media-atendimentos"
import { MaisPedidos } from "@/app/_components/analytics-charts/servicos-mais-pedidos"
import { authOptions } from "@/app/_lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { FC } from "react"

interface pageProps {}

const page: FC<pageProps> = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (!session?.user.isAdmin) {
    redirect("/")
  }

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
      <FaturamentoSemana />
      <FaturamentoMes />
      <MediaAtendimentos />
      <MaisPedidos />
    </section>
  )
}

export default page
