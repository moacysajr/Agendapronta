import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MenuIcon, ArrowLeftIcon } from "lucide-react" 
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/">
          <Button size="icon" variant="outline">
            <ArrowLeftIcon size={18} /> 
          </Button>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
