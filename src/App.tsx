import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Partners from './pages/Partners'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Part100vsPart53 from './pages/blog/Part100vsPart53'
import SeismicDesignShift from './pages/blog/SeismicDesignShift'
import FermiBenchSOTA from './pages/blog/FermiBenchSOTA'
import Prototype from './pages/Prototype'
import Deck from './pages/Deck'

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/deck" element={<Deck />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/part100-vs-part53-siting" element={<Part100vsPart53 />} />
          <Route path="/blog/seismic-design-shift" element={<SeismicDesignShift />} />
          <Route path="/blog/fermibench-sota" element={<FermiBenchSOTA />} />
          <Route path="/prototype" element={<Prototype />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
