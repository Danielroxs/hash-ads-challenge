'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { wordmarkTop, wordmarkBottom } from '@/lib/animations'

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] min-[1920px]:max-w-[1800px] min-[2560px]:max-w-[2400px]">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <motion.div whileHover="hover" initial="initial">
              <Link href="/campaigns" className="text-xl font-bold tracking-tighter text-foreground">
                <span className="relative inline-block overflow-hidden">
                  <motion.span className="block" variants={wordmarkTop}>
                    HASH
                  </motion.span>
                  <motion.span className="absolute inset-0" variants={wordmarkBottom}>
                    HASH
                  </motion.span>
                </span>
              </Link>
            </motion.div>
            <div className="h-4 w-px bg-border" />
            <p className="text-xs text-muted-foreground">Ads Dashboard</p>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">En vivo</span>
            </div>

            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="h-4 w-4" />
              ) : resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted border border-border">
              <span className="text-xs font-medium text-muted-foreground">DA</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}