import { Routes, Route } from 'react-router-dom';
import { MasterLayout } from './pages/MasterLayout';
import { Demo } from './components/blocks/demo';
import { AboutUs } from './pages/AboutUs';
import { OurTeam } from './pages/OurTeam';
import { OurPresence } from './pages/OurPresence';
import { PatientCare } from './pages/PatientCare';
import { Culture } from './pages/Culture';
import { Careers } from './pages/Careers';
import { ContactUs } from './pages/ContactUs';
import { Journey } from './pages/Journey';
import { Announcements } from './pages/Announcements';
import { Nuclear } from './pages/Nuclear';
import { Drones } from './pages/Drones';
import { Energy } from './pages/Energy';
import { Industrial } from './pages/Industrial';
import { Medical } from './pages/Medical';

function App() {
  return (
    <div className="dark min-h-screen max-w-[100vw] overflow-x-hidden bg-background text-foreground antialiased font-sans">
      <MasterLayout>
        <Routes>
          <Route path="/" element={<Demo />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/our-presence" element={<OurPresence />} />
          <Route path="/patient-care" element={<PatientCare />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/industries/nuclear" element={<Nuclear />} />
          <Route path="/industries/drones" element={<Drones />} />
          <Route path="/industries/energy" element={<Energy />} />
          <Route path="/industries/industrial" element={<Industrial />} />
          <Route path="/industries/medical" element={<Medical />} />
        </Routes>
      </MasterLayout>
    </div>
  )
}

export default App
