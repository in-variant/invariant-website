import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Part100vsPart53 from './pages/blog/Part100vsPart53'
import SeismicDesignShift from './pages/blog/SeismicDesignShift'
import FermiBenchSOTA from './pages/blog/FermiBenchSOTA'
import Product from './pages/Product'
import Pricing from './pages/Pricing'
import Probe from './pages/Probe'
import Deck from './pages/Deck'
import DroneDeck from './pages/DroneDeck'
import SpantrikDeck from './pages/SpantrikDeck'
import IntomesDeck from './pages/IntomesDeck'
import CustomerDeck from './pages/CustomerDeck'
import InsuranceDeck from './pages/InsuranceDeck'

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/deck" element={<Deck />} />
        <Route path="/drone-deck" element={<DroneDeck />} />
        <Route path="/spantrik" element={<SpantrikDeck />} />
        <Route path="/intomes" element={<IntomesDeck />} />
        <Route path="/customer-deck" element={<CustomerDeck />} />
        <Route path="/insurance-deck" element={<InsuranceDeck />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/part100-vs-part53-siting" element={<Part100vsPart53 />} />
          <Route path="/blog/seismic-design-shift" element={<SeismicDesignShift />} />
          <Route path="/blog/fermibench-sota" element={<FermiBenchSOTA />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/probe" element={<Probe />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}
