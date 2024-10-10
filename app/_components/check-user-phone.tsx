import { FC } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import AddPhoneBanner from "./add-phone-banner"

const CheckUserPhone: FC = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  const currentUserData = await db.user.findUnique({
    where: {
      id: session?.user.id,
    },
  })

  if (currentUserData?.phone != null) {
    return null
  }

  return <AddPhoneBanner userId={session.user.id} />
}

export default CheckUserPhone
