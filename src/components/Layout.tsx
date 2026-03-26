import { Outlet } from 'react-router-dom'
import { Header } from '@/components/ui/header-3'
import { Footer } from '@/components/ui/footer'

export default function Layout() {
  return (
    <div className="paper-grain min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
