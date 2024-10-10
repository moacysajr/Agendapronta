import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./_components/ui/button"
import { ArrowLeft } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <Image
        src="/404.svg"
        alt="Not Found"
        width={400}
        height={300}
        className="mb-4"
      />
      <Button asChild>
        <Link href={"/"}>
          <ArrowLeft className="mr-2 size-5" />
          Voltar para a página inicial
        </Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
