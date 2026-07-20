import Navbar from '@/components/navbar'
import Hero from '@/components/sections/hero'
import ResearchJourney from '@/components/sections/research-journey'
import LabTours from '@/components/sections/lab-tours'
import PhdMasters from '@/components/sections/phd-masters'
import Research101 from '@/components/sections/research-101'
import CvMaking from '@/components/sections/cv-making'
import Contact from '@/components/sections/contact'
import Footer from '@/components/footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ResearchJourney />
        <LabTours />
        <PhdMasters />
        <Research101 />
        <CvMaking />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
