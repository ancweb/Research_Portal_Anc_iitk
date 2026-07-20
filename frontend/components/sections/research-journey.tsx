'use client'

import { motion } from 'framer-motion'

const FORMATS = [
  {
    icon: '🎙️',
    label: 'Interviews',
    description: 'In-depth conversations with student researchers across departments',
  },
  {
    icon: '✍️',
    label: 'Blog Features',
    description: 'Written narratives capturing honest reflections on the research experience',
  },
  {
    icon: '🔬',
    label: 'Research Perspectives',
    description: 'Authentic insights into what it truly means to pursue research at IITK',
  },
]

export default function ResearchJourney() {
  return (
    <section id="research-journey" className="py-20 bg-white dark:bg-charcoal/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold mb-3 tracking-wide uppercase text-sm">Real Stories. Real Researchers.</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-6">
            Research Journey Series
          </h2>
          <p className="text-lg text-slate dark:text-cream/70 max-w-3xl mx-auto leading-relaxed">
            Students across disciplines share their experiences as student researchers through interviews and blog-style features —
            offering authentic perspectives, honest insights, and inspiring narratives from the heart of the IIT Kanpur research community.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {FORMATS.map((format, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-cream dark:bg-slate/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gold/10 hover:border-gold/30 text-center"
            >
              <div className="text-5xl mb-4">{format.icon}</div>
              <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-cream mb-3 group-hover:text-gold transition-colors">
                {format.label}
              </h3>
              <p className="text-slate dark:text-cream/70 leading-relaxed">{format.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-maroon/5 to-gold/5 border border-gold/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-1">
            <p className="text-gold font-semibold mb-2 text-sm uppercase tracking-wide">Why it matters</p>
            <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-cream mb-4">
              Learn from those who&apos;ve been there
            </h3>
            <p className="text-slate dark:text-cream/70 leading-relaxed">
              No textbook can tell you what it feels like to stay up debugging an experiment at 2 AM, or the joy of
              seeing your first results. The Research Journey Series brings those stories to you — unfiltered, from
              researchers who were once exactly where you are now.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center text-charcoal text-4xl font-serif font-bold">
              ✦
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
