'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Stats', href: '#stats' },
  { label: 'Testimonials', href: '#testimonials' },
];

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: 'easeInOut',
    },
  }),
};

const mobileMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1] as const,
      when: 'afterChildren',
    },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1] as const,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group relative"
          onClick={() => setOpen(false)}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center"
          >
            <Image
              src="/logo.png"
              alt="Agrovia"
              width={36}
              height={36}
              className={cn(
                'object-contain transition-all duration-300',
                scrolled ? 'w-9 h-9' : 'w-10 h-10'
              )}
              priority
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={cn(
              'font-black text-[17px] tracking-tight transition-all duration-300',
              scrolled ? 'text-neutral-900' : 'text-white',
              'hidden sm:inline-block'
            )}
          >
            Agrovia
          </motion.span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }, i) => (
            <motion.a
              key={label}
              href={href}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
              className={cn(
                'text-sm font-medium transition-all duration-200 relative',
                scrolled
                  ? 'text-neutral-500 hover:text-neutral-900'
                  : 'text-white/80 hover:text-white'
              )}
            >
              {label}
              <motion.span
                className={cn(
                  'absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300',
                  scrolled ? 'bg-emerald-600' : 'bg-emerald-400'
                )}
                whileHover={{ width: '100%' }}
              />
            </motion.a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="hidden md:flex items-center gap-3"
        >
          <Link
            href="/auth?mode=login"
            className={cn(
              'text-sm font-semibold px-4 py-2  transition-all duration-200',
              scrolled
                ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            )}
          >
            Sign In
          </Link>
          <Link
            href="/auth?mode=register"
            className="text-sm font-bold px-5 py-2  bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-200 shadow-md shadow-emerald-900/20 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Mobile hamburger */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'md:hidden p-2 rounded-lg transition-all duration-200 relative z-20',
            scrolled
              ? 'text-neutral-700 hover:bg-neutral-100'
              : 'text-white hover:bg-white/10'
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-10"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden overflow-hidden relative z-20"
          >
            <div className="bg-white border-t border-neutral-100 px-5 py-5 flex flex-col gap-1 shadow-xl">
              {NAV_LINKS.map(({ label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  variants={mobileItemVariants}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 py-2.5 px-3 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {label}
                </motion.a>
              ))}
              <motion.div
                variants={mobileItemVariants}
                className="h-px bg-neutral-100 my-2"
              />
              <motion.div variants={mobileItemVariants}>
                <Link
                  href="/auth?mode=login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-neutral-600 py-2.5 px-3 rounded-lg hover:bg-neutral-50 transition-colors block"
                >
                  Sign In
                </Link>
              </motion.div>
              <motion.div variants={mobileItemVariants}>
                <Link
                  href="/auth?mode=register"
                  onClick={() => setOpen(false)}
                  className="text-sm font-bold text-emerald-600 py-2.5 px-3 rounded-lg hover:bg-emerald-50 transition-colors block"
                >
                  Get Started →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}