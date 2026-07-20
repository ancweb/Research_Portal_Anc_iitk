'use client'

import { motion } from 'framer-motion'

const WHAT_YOU_LEARN = [
  'PhD and Masters programs at internationally renowned universities',
  'How to navigate application timelines and deadlines',
  'Statement of Purpose (SOP) and recommendation letter strategy',
  'Shortlisting universities that match your research interests',
  'Funding, fellowships, and financial aid opportunities',
  'Life as a graduate student abroad — what to expect',
]

export default function PhdMasters() {
  return (
    <section id="phd-masters" className="py-20 bg-white dark:bg-charcoal/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold mb-3 tracking-wide uppercase text-sm">Higher Studies Abroad</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-6">
            PhD &amp; Masters Applications
          </h2>
          <p className="text-lg text-slate dark:text-cream/70 max-w-3xl mx-auto leading-relaxed">
            A dedicated guidance session for students aspiring to pursue higher studies abroad. Learn about PhD and Masters
            programs at internationally renowned universities, navigate application timelines, and discover the
            opportunities that await beyond IIT Kanpur.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-8 border border-gold/20">
              <h3 className="font-serif text-2xl font-bold text-maroon mb-2">What the Session Covers</h3>
              <p className="text-slate dark:text-cream/70 text-sm mb-6 leading-relaxed">
                Everything you need to know to build a strong international application — from shortlisting to submission.
              </p>
              <ul className="space-y-4">
                {WHAT_YOU_LEARN.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-gold font-bold mt-0.5 shrink-0">✓</span>
                    <span className="text-slate dark:text-cream/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-maroon/5 to-maroon/0 rounded-2xl p-8 border border-maroon/20">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-cream mb-3">PhD Programs</h3>
              <p className="text-slate dark:text-cream/70 leading-relaxed">
                Explore fully-funded doctoral programs at top universities worldwide. Learn how to identify the right
                advisors, craft your research proposal, and stand out in a competitive applicant pool.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate/10 to-slate/5 rounded-2xl p-8 border border-slate/20 dark:border-cream/10">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-cream mb-3">Masters Programs</h3>
              <p className="text-slate dark:text-cream/70 leading-relaxed">
                Understand the landscape of MS and MEng programs abroad — course-based vs. thesis-based, funding options,
                and how to leverage your IITK background to its fullest.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 border border-gold/20 text-center">
              <p className="text-slate dark:text-cream/70 text-sm mb-1">Who should attend?</p>
              <p className="font-serif text-xl font-bold text-charcoal dark:text-cream">
                Anyone curious about what comes after IITK.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
