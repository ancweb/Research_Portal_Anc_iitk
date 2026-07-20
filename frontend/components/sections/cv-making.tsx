'use client'

import { motion } from 'framer-motion'

const CV_TOPICS = [
  {
    label: 'CV Fundamentals',
    description: 'Structure your academic profile clearly — what to include, what to cut, and how to present it for research applications.',
  },
  {
    label: 'Research-Oriented Formatting',
    description: 'A research CV is different from a placement CV. Learn how to highlight research roles, projects, and academic achievements front and centre.',
  },
  {
    label: 'Professor Outreach Emails',
    description: 'Writing cold emails that get responses. Learn the anatomy of an effective outreach email and how to personalize it for each professor.',
  },
  {
    label: 'SURGE & Research Projects',
    description: 'Tailor your CV to IITK\'s Summer Undergraduate Research Grant for Excellence and other on-campus research programs.',
  },
  {
    label: 'International Opportunities',
    description: 'Craft a CV suitable for international research internships, exchange programs, and summer research fellowships abroad.',
  },
  {
    label: 'PhD & Masters Applications',
    description: 'How a research CV feeds into graduate school applications — what admission committees look for and how to tell your story.',
  },
]

export default function CvMaking() {
  return (
    <section id="cv-making" className="py-20 bg-white dark:bg-charcoal/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold mb-3 tracking-wide uppercase text-sm">Career Development</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-6">
            CV Making
          </h2>
          <p className="text-lg text-slate dark:text-cream/70 max-w-3xl mx-auto leading-relaxed">
            Build a research-oriented CV that opens doors. This session covers the fundamentals of crafting a compelling
            Curriculum Vitae — from structuring your academic profile to writing effective professor outreach emails.
            You&apos;ll leave with the skills to put your best foot forward.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-16">
          {CV_TOPICS.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="flex gap-4 mb-5"
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold text-charcoal font-bold text-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
              <div className="flex-grow bg-cream dark:bg-slate/20 rounded-xl p-6 border border-gold/20 hover:border-gold/50 transition-colors">
                <h3 className="font-serif text-xl font-bold text-charcoal dark:text-cream mb-2">{topic.label}</h3>
                <p className="text-slate dark:text-cream/70 text-sm leading-relaxed">{topic.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-maroon/5 to-gold/5 border border-gold/20 rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gold font-semibold mb-2 text-sm uppercase tracking-wide">You&apos;ll walk away ready for</p>
              <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-cream mb-4">
                Every research opportunity that matters
              </h3>
              <ul className="space-y-3">
                {[
                  'Research internships & SURGE applications',
                  'Academic and international opportunities',
                  'PhD and Masters applications abroad',
                  'On-campus research projects',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-slate dark:text-cream/80">
                    <span className="text-gold font-bold shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="font-serif text-xl font-bold text-charcoal dark:text-cream mb-2">
                One great CV.
              </p>
              <p className="text-slate dark:text-cream/70">Endless opportunities.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
