'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const TEAM_MEMBERS = [
  {
    name: 'Anshu',
    email: 'anshus24@iitk.ac.in',
    role: 'Research Wing Manager',
    avatar: '/placeholder-user.jpg', // default profile picture for the manager
  },
  {
    name: 'Antriksh Singhal',
    email: 'antrikshs24@iitk.ac.in',
    role: 'Research Wing Manager',
    avatar: "/antriksh_research.webp",
  },
  {
    name: 'Neha',
    email: 'ensri24@iitk.ac.in',
    role: 'Research Wing Manager',
    avatar: "/neha.webp",
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-gradient-to-r from-maroon to-maroon/80">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl font-bold text-cream mb-4">Get in Touch</h2>
          <p className="text-cream/80 max-w-2xl mx-auto">
            Have questions about our research programs? We&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Contact method cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              label: 'Email',
              value: 'research@iitk.ac.in',
              action: 'mailto:research@iitk.ac.in',
            },
            {
              label: 'Phone',
              value: '+91-512-259-XXXX',
              action: 'tel:+91512259',
            },
            {
              label: 'Portal',
              value: 'Research Portal',
              action: '#',
            },
          ].map((method, index) => (
            <motion.a
              key={index}
              href={method.action}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group block text-center"
            >
              <div className="bg-white/10 hover:bg-gold/20 rounded-xl p-8 transition-all duration-300 border border-cream/20 hover:border-gold/50">
                <p className="text-cream/60 text-sm font-semibold mb-2">{method.label}</p>
                <p className="text-cream font-serif text-2xl font-bold group-hover:text-gold transition-colors">
                  {method.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Team section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="font-serif text-3xl font-bold text-cream mb-2">Meet the Team</h3>
          <p className="text-cream/70 text-sm">The people behind the Research Portal</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.email}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="bg-white/10 hover:bg-gold/20 border border-cream/20 hover:border-gold/50 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300"
            >
              {/* Avatar */}
              <div className="mb-4">
                {member.avatar ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gold/60">
                    <Image
                      src={member.avatar}
                      alt={`${member.name} profile picture`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 rounded-full bg-gold/30 ring-2 ring-gold/60 flex items-center justify-center"
                    aria-label={`${member.name} initials avatar`}
                  >
                    <span className="text-cream font-bold text-2xl select-none">
                      {getInitials(member.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <p className="text-cream font-serif text-xl font-bold mb-0.5">{member.name}</p>
              <p className="text-gold text-xs font-semibold uppercase tracking-wide mb-3">
                {member.role}
              </p>
              <a
                href={`mailto:${member.email}`}
                className="text-cream/70 hover:text-gold text-sm transition-colors break-all"
              >
                {member.email}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
