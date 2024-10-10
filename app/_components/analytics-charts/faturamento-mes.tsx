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

export default function FaturamentoMes() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Faturamento Mensal</CardDescription>
        <CardTitle className="text-4xl">$5,329</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          +10% comparado ao mês passado
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={12} aria-label="12% increase" />
      </CardFooter>
    </Card>
  )
}
