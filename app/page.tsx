/* eslint-disable react-hooks/refs */
'use client';

import { Navbar } from '@/components/Navbar';
import { HeroSlider } from '@/components/HeroSlider';
import { Footer } from '@/components/Footer';
import { motion, useInView, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Activity,
  Shield,
  Smartphone,
  Globe,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  MapPin,
  Bell,
  BarChart3,
  Target,
  Eye,
  Clock,
  Zap,
  ChevronDown,
  Sprout,
  Radio,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Activity,
    title: 'Real-Time Field Monitoring',
    desc: "Track every field's health, stage, and activity as it happens. One unified dashboard for coordinators and agents.",
    accent: 'from-emerald-500/10 to-emerald-600/5',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Automatic Risk Detection',
    desc: 'Agrovia flags fields that have been neglected or overdue — before losses occur. Stay ahead of every harvest cycle.',
    accent: 'from-amber-500/10 to-amber-600/5',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First for Agents',
    desc: 'Optimized for field-ready use. Agents log updates, observations, and stage changes right from the land.',
    accent: 'from-sky-500/10 to-sky-600/5',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    icon: Users,
    title: 'Multi-Agent Coordination',
    desc: 'Assign fields, track agent performance, and synchronize your team across regions without a single phone call.',
    accent: 'from-violet-500/10 to-violet-600/5',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: TrendingUp,
    title: 'Stage-by-Stage Insights',
    desc: 'From planting to harvest, every transition is timestamped — giving you a complete crop lifecycle view.',
    accent: 'from-emerald-500/10 to-teal-600/5',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
  {
    icon: Globe,
    title: 'Built for African Agriculture',
    desc: 'Designed around local farming cycles, regional crop types, and the realities of smallholder coordination.',
    accent: 'from-orange-500/10 to-orange-600/5',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
];

const MINI_FEATURES = [
  { icon: MapPin, title: 'GPS Field Mapping', desc: 'Pin exact field locations with coordinates.' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Get notified the moment a field goes at risk.' },
  { icon: BarChart3, title: 'Harvest Analytics', desc: 'Track yield trends across seasons and regions.' },
  { icon: Clock, title: 'Timeline View', desc: 'Complete history of every field update.' },
];

const STEPS = [
  {
    number: '01',
    title: 'Set up your fields',
    desc: 'Add fields with crop type, planting date, and location. Assign them to field agents in seconds.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    bullets: ['Bulk field import', 'Auto-assign by region', 'Custom harvest windows'],
    color: 'emerald',
  },
  {
    number: '02',
    title: 'Agents log updates',
    desc: 'Field agents record observations, stage changes, and risk flags directly from the farm.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80',
    bullets: ['Works offline', 'Photo notes', 'One-tap stage updates'],
    color: 'teal',
  },
  {
    number: '03',
    title: 'Monitor everything',
    desc: 'Dashboard shows real-time status across all fields. Nothing falls through the cracks.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80',
    bullets: ['Live activity feed', 'At-risk alerts', 'Performance reports'],
    color: 'emerald',
  },
];

const STATS = [
  { value: '6', label: 'Core features', icon: Target, description: 'Complete field management suite' },
  { value: '2', label: 'User roles', icon: Users, description: 'Coordinator & Agent' },
  { value: 'Live', label: 'Updates', icon: Zap, description: 'Real-time field status' },
  { value: '100%', label: 'Visibility', icon: Eye, description: 'End-to-end crop monitoring' },
];

const TESTIMONIALS = [
  {
    name: 'Amara Diallo',
    role: 'Agricultural Coordinator',
    region: 'Senegal',
    quote: 'Before Agrovia, I was managing 60 fields over WhatsApp. Now I see everything in one place.',
    rating: 5,
    initials: 'AD',
  },
  {
    name: 'Kelvin Otieno',
    role: 'Field Agent',
    region: 'Kenya',
    quote: 'The mobile interface is fast even with poor network. Log updates and move on — no waiting.',
    rating: 5,
    initials: 'KO',
  },
  {
    name: 'Fatima Bah',
    role: 'Smallholder Coordinator',
    region: 'Guinea',
    quote: 'The at-risk alerts alone saved two of our maize fields this season. Game changer.',
    rating: 5,
    initials: 'FB',
  },
];

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="w-6 h-px bg-emerald-500" />
      <p className="text-emerald-600 text-[11px] font-bold uppercase tracking-[0.3em]">{children}</p>
      <span className="w-6 h-px bg-emerald-500" />
    </div>
  );
}

function useSectionInView() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return { ref, inView };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const features = useSectionInView();
  const steps = useSectionInView();
  const stats = useSectionInView();
  const testimonials = useSectionInView();
  const cta = useSectionInView();

  // Parallax for the divider visual
  const dividerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: dividerRef, offset: ['start end', 'end start'] });
  const dividerY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSlider />

      {/* ── Trust Bar ─────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="border-b border-neutral-100 py-4 bg-white"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5">
            {[
              'For farm coordinators',
              'For field agents',
              'Real-time dashboard',
              'Crop lifecycle tracking',
              'Risk detection',
            ].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="flex items-center gap-2 text-sm text-neutral-500"
              >
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span className="font-medium">{t}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section id="features" ref={features.ref} className="py-28 bg-white relative">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(#16a34a 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
          <motion.div
            initial="hidden"
            animate={features.inView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <SectionLabel>Platform Features</SectionLabel>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 leading-[1.05] tracking-tight">
              Everything you need.
              <br />
              <span className="text-emerald-600">Nothing you don&apos;t.</span>
            </h2>
            <p className="mt-5 text-neutral-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              From field monitoring to harvest analytics — Agrovia gives your team a single source of truth.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={features.inView ? 'visible' : 'hidden'}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map(({ icon: Icon, title, desc, accent, iconBg, iconColor }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative p-7 border border-neutral-100 hover:border-neutral-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient sweep on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`w-11 h-11 ${iconBg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                  <h3 className="text-[15px] font-bold text-neutral-900 mb-2.5 leading-snug">{title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mini features strip */}
          <motion.div
            initial="hidden"
            animate={features.inView ? 'visible' : 'hidden'}
            variants={stagger}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {MINI_FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-neutral-50 border border-neutral-100 hover:border-emerald-100 hover:bg-emerald-50/40 flex gap-3 items-start transition-all duration-200"
              >
                <Icon size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-neutral-800">{title}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Divider — full-width image with parallax ──────────────────── */}
      <div ref={dividerRef} className="relative h-64 md:h-80 overflow-hidden">
        <motion.div style={{ y: dividerY }} className="absolute inset-0 scale-110">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-emerald-950/70" />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 justify-center mb-3">
              <Radio size={14} className="text-emerald-400 animate-pulse" />
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em]">Live Platform</p>
            </div>
            <p className="text-white text-2xl md:text-4xl font-black leading-tight max-w-2xl">
              Real crops. Real decisions.
              <br />
              <span className="text-emerald-400">Real time.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section id="how-it-works" ref={steps.ref} className="py-28 bg-neutral-950 relative overflow-hidden">
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
          <motion.div
            initial="hidden"
            animate={steps.inView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Simple workflow.
              <br />
              <span className="text-emerald-400">Powerful results.</span>
            </h2>
          </motion.div>

          <div className="space-y-28">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial="hidden"
                animate={steps.inView ? 'visible' : 'hidden'}
                variants={fadeUp}
                transition={{ delay: i * 0.12 }}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-14 lg:gap-20 items-center`}
              >
                {/* Text */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[80px] font-black leading-none text-white/[0.06] select-none">{step.number}</span>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Step {step.number}</span>
                      <div className="w-8 h-0.5 bg-emerald-500" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">{step.title}</h3>
                  <p className="text-neutral-400 text-base leading-relaxed max-w-md">{step.desc}</p>
                  <ul className="space-y-2.5">
                    {step.bullets.map((pt) => (
                      <li key={pt} className="flex items-center gap-3 text-sm text-neutral-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={11} className="text-emerald-400" />
                        </div>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className="flex-1 w-full">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
                  >
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent" />
                    {/* Step badge */}
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3 py-1 uppercase tracking-wider">
                      Step {step.number}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section ref={stats.ref} className="py-20 bg-white border-y border-neutral-100 relative overflow-hidden">
        {/* Decorative large text behind */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[180px] font-black text-neutral-900/[0.02] leading-none tracking-tighter whitespace-nowrap">AGROVIA</span>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 relative">
          <motion.div
            initial="hidden"
            animate={stats.inView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <SectionLabel>Platform Capabilities</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
              What Agrovia delivers
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={stats.inView ? 'visible' : 'hidden'}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-100"
          >
            {STATS.map(({ value, label, icon: Icon, description }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                whileHover={{ backgroundColor: '#f0fdf4' }}
                className="text-center p-10 bg-white transition-colors duration-300 flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center">
                  <Icon size={22} className="text-emerald-600" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-neutral-900">{value}</p>
                <p className="text-sm font-bold text-neutral-700">{label}</p>
                <p className="text-xs text-neutral-400 leading-snug max-w-[120px]">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section ref={testimonials.ref} className="py-28 bg-neutral-50 relative overflow-hidden">
        {/* Diagonal stripe decoration */}
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
        />

        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <motion.div
            initial="hidden"
            animate={testimonials.inView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 leading-tight tracking-tight">
              Trusted by agricultural teams
              <br />
              <span className="text-emerald-600">across Africa.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={testimonials.inView ? 'visible' : 'hidden'}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {TESTIMONIALS.map(({ name, role, region, quote, rating, initials }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)' }}
                transition={{ duration: 0.25 }}
                className={`p-7 bg-white border border-neutral-100 transition-all duration-300 ${i === 1 ? 'md:mt-6' : ''}`}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-neutral-700 text-[15px] leading-relaxed mb-6 font-medium">
                  &ldquo;{quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-neutral-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-white">{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{name}</p>
                    <p className="text-[11px] text-neutral-500">{role} · {region}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1">
                      <MapPin size={9} />
                      {region}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section ref={cta.ref} className="relative py-32 bg-neutral-950 overflow-hidden">
        {/* Background field image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/60 to-neutral-950/90" />
        </div>

        {/* Animated emerald glow orb */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600 blur-[120px] pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate={cta.inView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-2 justify-center mb-6">
                <Sprout size={16} className="text-emerald-400" />
                <p className="text-emerald-400 text-[11px] font-bold uppercase tracking-[0.3em]">Get Started Today</p>
                <Sprout size={16} className="text-emerald-400" />
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              Ready to transform your
              <br />
              <span className="text-emerald-400">field monitoring?</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-neutral-400 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Join Agrovia and start managing your fields with real-time data and intelligent risk detection.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/auth?mode=register"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors shadow-lg shadow-emerald-900/40"
              >
                Start as Agent
                <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white text-sm font-semibold transition-all"
              >
                Sign In
              </motion.a>
            </motion.div>

            {/* Small reassurance line */}
            <motion.p variants={fadeUp} className="mt-8 text-neutral-600 text-xs">
              No credit card required · Free to get started · Built for African agriculture
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}