import { Card, CardContent } from "./ui/card"

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardContent className="flex justify-end px-5 py-6">
          {/* TODO: Adicionar nosso link para a LP */}
          <p className="text-sm text-gray-400">
            © 2024 Copyright <span className="font-bold">Agenda Pronta</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
