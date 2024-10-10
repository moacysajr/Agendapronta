"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Progress } from "../ui/progress"

export default function FaturamentoSemana() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Faturamento essa semana</CardDescription>
        <CardTitle className="text-4xl">R$1,329</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          +25% comparando semana passada
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={25} aria-label="25% increase" />
      </CardFooter>
    </Card>
  )
}
