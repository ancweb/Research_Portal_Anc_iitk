import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ResearchPortalContent from '@/components/research-portal-content'

export default function ResearchPortal() {
  return (
    <>
      <Navbar />
      <main>
        <ResearchPortalContent />
      </main>
      <Footer />
    </>
  )
}
