import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-maroon text-cream py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold mb-2">IIT Kanpur Research Wing</h3>
            <p className="text-cream/80">Advancing knowledge through interdisciplinary research</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:research@iitk.ac.in"
              className="px-6 py-2 rounded-full bg-gold text-charcoal font-semibold hover:bg-gold/90 transition-colors text-center"
            >
              Email
            </a>
          </div>
        </div>

        <div className="border-t border-gold/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-cream/60">© 2026 Indian Institute of Technology Kanpur. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://www.linkedin.com/company/research-wing-anc-iitk/" className="hover:text-gold transition-colors">
              LinkedIn
            </a>
            <a href="https://www.instagram.com/iitk_research_wing/" className="hover:text-gold transition-colors">
              Instagram
            </a>
            <a href="https://www.youtube.com/@ResearchWingAnCIIT-Kanpur" className="hover:text-gold transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}


// https://www.linkedin.com/company/research-wing-anc-iitk/
// https://www.instagram.com/iitk_research_wing/
// https://www.youtube.com/@ResearchWingAnCIIT-Kanpur

