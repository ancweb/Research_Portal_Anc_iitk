'use client'

import { motion } from 'framer-motion'

const TOPICS = [
  {
    icon: '🔍',
    title: 'Research Opportunities at IITK',
    description: 'A clear overview of how and where you can get involved in research on campus — from faculty-led projects to student initiatives.',
  },
  {
    icon: '🚀',
    title: 'Careers in Research',
    description: 'What does a research-driven career actually look like? Understand the paths available and how to start building towards them.',
  },
  {
    icon: '🎓',
    title: 'Senior Student Experiences',
    description: 'Senior students actively engaged in research share their personal campus journeys, what worked, and what they wish they knew earlier.',
  },
  {
    icon: '🎯',
    title: 'Long-term Research Goals',
    description: 'Get a clear picture of what a research-driven path looks like beyond graduation — from graduate school to academia to industry R&D.',
  },
  {
    icon: '🤝',
    title: 'Finding Your First Project',
    description: 'Practical advice on how to reach out to professors, find open positions, and land your first research opportunity at IITK.',
  },
  {
    icon: '📖',
    title: 'What Research Actually Involves',
    description: 'Honest insights into the day-to-day of research life — the challenges, the breakthroughs, and what keeps researchers going.',
  },
]

export default function Research101() {
  return (
    <section id="research-101" className="py-20 bg-cream dark:bg-charcoal">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold mb-3 tracking-wide uppercase text-sm">New to Research?</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-6">
            Research 101
          </h2>
          <p className="text-lg text-slate dark:text-cream/70 max-w-3xl mx-auto leading-relaxed">
            This introductory session covers research opportunities at IITK and careers in research. Senior students
            actively engaged in research share their campus experiences and long-term goals — giving you a clear picture
            of what a research-driven path looks like.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TOPICS.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group bg-white dark:bg-slate/10 rounded-2xl p-8 border border-gold/10 hover:border-gold/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="font-serif text-xl font-bold text-charcoal dark:text-cream mb-3 group-hover:text-gold transition-colors">
                {topic.title}
              </h3>
              <p className="text-slate dark:text-cream/70 text-sm leading-relaxed">{topic.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-white dark:bg-slate/10 border border-gold/20 rounded-2xl p-8"
        >
          <p className="text-gold font-semibold mb-2 text-sm uppercase tracking-wide">Perfect for</p>
          <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-cream mb-3">
            Every student who has ever wondered &ldquo;where do I even start?&rdquo;
          </h3>
          <p className="text-slate dark:text-cream/70 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a first-year trying to figure out research, or a second-year looking for direction,
            Research 101 is the session that answers the questions you didn&apos;t know to ask.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
