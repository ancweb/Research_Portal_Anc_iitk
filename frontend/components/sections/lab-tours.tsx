'use client'

import { motion } from 'framer-motion'

const LAB_HIGHLIGHTS = [
  {
    number: '01',
    title: 'Designed for Freshers',
    description: 'Lab Tours are crafted specifically for incoming students — no prior research experience needed. Just bring your curiosity.',
  },
  {
    number: '02',
    title: 'Active Laboratories',
    description: 'Step inside real, working labs across departments and see the kind of research happening right on campus.',
  },
  {
    number: '03',
    title: 'Spark Early Interest',
    description: 'Discover fields you never knew you were passionate about, and start building connections with research groups from day one.',
  },
]

export default function LabTours() {
  return (
    <section id="lab-tours" className="py-20 bg-cream dark:bg-charcoal">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold mb-3 tracking-wide uppercase text-sm">For Incoming Students</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-6">
            Lab Tours
          </h2>
          <p className="text-lg text-slate dark:text-cream/70 max-w-3xl mx-auto leading-relaxed">
            A guided introduction to the vibrant research culture at IIT Kanpur, designed especially for incoming students.
            Lab Tours take freshers into active laboratories across departments — sparking curiosity, building early research
            interest, and helping students integrate research into their academic journey right from day one.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {LAB_HIGHLIGHTS.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white dark:bg-slate/10 rounded-xl p-8 border border-gold/20 hover:border-gold/50 transition-colors h-full">
                <div className="text-5xl font-serif font-bold text-gold/20 mb-4">{feature.number}</div>
                <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-cream mb-3">{feature.title}</h3>
                <p className="text-slate dark:text-cream/70 leading-relaxed">{feature.description}</p>

                <div className="mt-6 pt-6 border-t border-gold/10">
                  <div className="w-12 h-1 bg-gradient-to-r from-gold to-gold/50 rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-maroon to-maroon/80 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 className="font-serif text-2xl font-bold mb-2">Start exploring on day one</h3>
            <p className="text-cream/80 max-w-xl leading-relaxed">
              Research doesn&apos;t have to wait until your third year. Lab Tours are your first step into a world
              of discovery — and it starts the moment you arrive at IITK.
            </p>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="text-5xl mb-2">🧪</div>
            <p className="text-gold font-semibold text-sm">Open to all freshers</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
