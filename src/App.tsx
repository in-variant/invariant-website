import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Partners from './pages/Partners'
import Contact from './pages/Contact'
import Nuclear from './pages/industries/Nuclear'
import Drones from './pages/industries/Drones'
import EVTOLs from './pages/industries/EVTOLs'
import Defense from './pages/industries/Defense'
import Robotics from './pages/industries/Robotics'
import Automotive from './pages/industries/Automotive'

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/industries/nuclear" element={<Nuclear />} />
          <Route path="/industries/drones" element={<Drones />} />
          <Route path="/industries/evtols" element={<EVTOLs />} />
          <Route path="/industries/defense" element={<Defense />} />
          <Route path="/industries/robotics" element={<Robotics />} />
          <Route path="/industries/automotive" element={<Automotive />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
