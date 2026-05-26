import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  // The home hero runs full-bleed under the transparent nav; every other page
  // needs to clear the fixed 60px nav so content isn't hidden behind it.
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Nav />
      <main className={`flex-1 ${isHome ? '' : 'pt-[64px]'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
