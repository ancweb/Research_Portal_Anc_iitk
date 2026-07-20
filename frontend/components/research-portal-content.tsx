'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function ResearchPortalContent() {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const opportunities = [
    {
      id: 1,
      title: 'AI-Driven Healthcare Solutions',
      category: 'AI & Computing',
      level: 'PhD',
      description: 'Develop machine learning models for disease prediction and diagnostic support systems.',
      mentor: 'Dr. Rajesh Kumar',
    },
    {
      id: 2,
      title: 'Sustainable Materials for Green Energy',
      category: 'Materials Science',
      level: 'Masters',
      description: 'Research novel materials for efficient solar cells and energy storage applications.',
      mentor: 'Dr. Priya Singh',
    },
    {
      id: 3,
      title: 'Autonomous Navigation Systems',
      category: 'Robotics & Automation',
      level: 'PhD',
      description: 'Design and implement advanced autonomous navigation for UAVs and ground robots.',
      mentor: 'Dr. Arjun Patel',
    },
    {
      id: 4,
      title: 'Biomedical Signal Processing',
      category: 'Biotechnology',
      level: 'Masters',
      description: 'Analyze and process biomedical signals for real-time health monitoring.',
      mentor: 'Dr. Anjali Verma',
    },
    {
      id: 5,
      title: 'Quantum Computing Algorithms',
      category: 'AI & Computing',
      level: 'PhD',
      description: 'Develop quantum algorithms for optimization and cryptography problems.',
      mentor: 'Dr. Vikram Sharma',
    },
    {
      id: 6,
      title: 'Environmental Remediation Technologies',
      category: 'Environmental Engineering',
      level: 'Masters',
      description: 'Innovative approaches to clean water systems and soil contamination.',
      mentor: 'Dr. Neha Gupta',
    },
  ]

  const categories = ['all', 'AI & Computing', 'Materials Science', 'Robotics & Automation', 'Biotechnology', 'Environmental Engineering']
  const levels = ['all', 'PhD', 'Masters']

  return (
    <>
      <section className="pt-20 pb-12 bg-gradient-to-br from-cream via-white to-cream dark:from-charcoal dark:via-slate/10 dark:to-charcoal">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <Link href="/" className="text-gold hover:text-gold/80 transition-colors">
              Home
            </Link>
            <span className="text-slate dark:text-cream/60">/</span>
            <span className="text-charcoal dark:text-cream font-semibold">Research Portal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl font-bold text-charcoal dark:text-cream mb-4"
          >
            Research Opportunities
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate dark:text-cream/70 max-w-2xl"
          >
            Discover and join cutting-edge research initiatives at IIT Kanpur
          </motion.p>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-charcoal/50 border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-3">Search</label>
              <input
                type="text"
                placeholder="Search by title, area, or mentor..."
                className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 bg-cream dark:bg-slate/20 text-charcoal dark:text-cream placeholder-slate/50 transition-colors"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-3">Filter by Level</label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 bg-cream dark:bg-slate/20 text-charcoal dark:text-cream transition-colors"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream dark:bg-charcoal">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {opportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group bg-white dark:bg-slate/20 rounded-xl border border-gold/20 hover:border-gold/50 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold/10 text-gold">{opp.category}</span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-maroon/10 text-maroon">{opp.level}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-charcoal dark:text-cream mb-2 group-hover:text-gold transition-colors">
                  {opp.title}
                </h3>

                <p className="text-slate dark:text-cream/70 text-sm mb-4 leading-relaxed">{opp.description}</p>

                <div className="pt-4 border-t border-gold/10">
                  <p className="text-sm text-slate dark:text-cream/60 mb-4">
                    <span className="font-semibold">Mentor:</span> {opp.mentor}
                  </p>
                  <button className="w-full px-4 py-2 rounded-lg bg-maroon/10 text-maroon hover:bg-maroon hover:text-white transition-colors font-semibold text-sm">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-charcoal/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl font-bold text-charcoal dark:text-cream mb-4">
              Interested in a specific area?
            </h2>
            <p className="text-slate dark:text-cream/70 mb-8 max-w-2xl mx-auto">
              Contact our research coordinators to learn more about opportunities that match your interests and expertise.
            </p>
            <button className="px-8 py-3 bg-maroon text-white rounded-lg font-semibold hover:bg-maroon/90 transition-colors">
              Contact Us
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
