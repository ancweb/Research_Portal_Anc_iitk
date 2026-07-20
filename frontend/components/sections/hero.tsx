'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-cream via-white to-cream dark:from-charcoal dark:via-slate/10 dark:to-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#dots)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold font-semibold mb-4 tracking-wide">Welcome to IIT Kanpur</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-charcoal dark:text-cream mb-6">
            Where Innovation Meets <span className="text-gold">Discovery</span>
          </h1>
          <p className="text-xl text-slate dark:text-cream/80 mb-8 leading-relaxed max-w-2xl mx-auto">
            Explore cutting-edge research initiatives, connect with world-class researchers, and discover your potential in
            groundbreaking scientific advancement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#research-journey"
            className="px-8 py-4 rounded-lg bg-maroon text-white font-semibold hover:bg-maroon/90 transition-colors"
          >
            Explore Research
          </Link>
          <Link
            href="/research-portal"
            className="px-8 py-4 rounded-lg border-2 border-gold text-gold font-semibold hover:bg-gold/10 transition-colors"
          >
            Access Portal
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
