"use client"
import { FC } from "react"
import { Button } from "../_components/ui/button"
import { signIn } from "next-auth/react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions)
  const handleLoginWithGoogleClick = () => signIn("google")

  if (!session?.user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Para continuar é necessário logar.</CardTitle>
            <CardDescription>
              Conecte-se usando sua conta do Google e retorne para o seu
              agendamento!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full gap-1 font-bold"
              onClick={handleLoginWithGoogleClick}
            >
              <Image
                alt="Fazer login com o Google"
                src="/google.svg"
                width={18}
                height={18}
              />
              Google
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Login Concluído!</CardTitle>
          <CardDescription>
            Agora você pode continuar usando o app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full gap-1 font-bold" asChild>
            <Link href={"/"}>
              <ArrowLeft className="mr-2" />
              Voltar para Página Inicial
            </Link>
          </Button>
          {session.user.isAdmin && (
            <Button
              variant="outline"
              className="w-full gap-1 font-bold"
              asChild
            >
              <Link href={"/admin"}>
                <Lock className="mr-2" />
                Acessar área restrita
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default page
