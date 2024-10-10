/* eslint-disable no-unused-vars */
"use client"

import { FC } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"

interface EditAdminClientProps {
  isAdmin: boolean
  userId: string
  makeAdminAction: (
    userId: string,
  ) => Promise<{ success: boolean; message: string }>
  removeAdminAction: (
    userId: string,
  ) => Promise<{ success: boolean; message: string }>
}

const EditAdminClient: FC<EditAdminClientProps> = ({
  isAdmin,
  userId,
  makeAdminAction,
  removeAdminAction,
}) => {
  const handleAction = async (
    action: typeof makeAdminAction | typeof removeAdminAction,
  ) => {
    const result = await action(userId)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  if (!isAdmin) {
    return (
      <form action={() => handleAction(makeAdminAction)}>
        <Button type="submit" className="flex-shrink-0 grow-0">
          Tornar Admin
        </Button>
      </form>
    )
  }
  return (
    <form action={() => handleAction(removeAdminAction)}>
      <Button
        type="submit"
        className="flex-shrink-0 grow-0"
        variant="destructive"
      >
        Remover Admin
      </Button>
    </form>
  )
}

export default EditAdminClient
