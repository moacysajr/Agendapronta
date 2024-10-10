import { Metadata } from "next"
import AdminHeader from "../_components/adminComponents/AdminHeader"
import AsideMenu from "../_components/adminComponents/AsideMenu"

export const metadata: Metadata = {
  title: "Admin",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <AsideMenu />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <AdminHeader />
        <section className="px-5">{children}</section>
      </div>
    </div>
  )
}
