'use client';

import { Navbar } from '@/components/Navbar';
import { HeroSlider } from '@/components/HeroSlider';
import { Footer } from '@/components/Footer';
import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
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
} from 'lucide-react';

const FEATURES = [
  {
    icon: Activity,
    title: 'Real-Time Field Monitoring',
    desc: 'Track every field\'s health, stage, and activity as it happens. One unified dashboard for coordinators and agents.',
  },
  {
    icon: Shield,
    title: 'Automatic Risk Detection',
    desc: 'Agrovia flags fields that have been neglected or overdue — before losses occur. Stay ahead of every harvest cycle.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First for Field Agents',
    desc: 'Optimized for field-ready use. Agents log updates, observations, and stage changes right from the land.',
  },
  {
    icon: Users,
    title: 'Multi-Agent Coordination',
    desc: 'Assign fields, track agent performance, and synchronize your team across regions without a single phone call.',
  },
  {
    icon: TrendingUp,
    title: 'Stage-by-Stage Insights',
    desc: 'From planting to harvest, every transition is timestamped — giving you a complete crop lifecycle view.',
  },
  {
    icon: Globe,
    title: 'Built for African Agriculture',
    desc: 'Designed around local farming cycles, regional crop types, and the realities of smallholder coordination.',
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
  },
  {
    number: '02',
    title: 'Agents log updates',
    desc: 'Field agents record observations, stage changes, and risk flags directly from the farm.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80',
    bullets: ['Works offline', 'Photo notes', 'One-tap stage updates'],
  },
  {
    number: '03',
    title: 'Monitor everything',
    desc: 'Dashboard shows real-time status across all fields. Nothing falls through the cracks.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80',
    bullets: ['Live activity feed', 'At-risk alerts', 'Performance reports'],
  },
];

// Honest stats - features and goals, not fake achievements
const STATS = [
  { value: '6', label: 'Core features', icon: Target, description: 'Complete field management suite' },
  { value: '2', label: 'User roles', icon: Users, description: 'Admin(Coordinator), Agent' },
  { value: 'Real-time', label: 'Updates', icon: Zap, description: 'Live field status tracking' },
  { value: 'Full', label: 'Visibility', icon: Eye, description: 'End-to-end crop monitoring' },
];

const TESTIMONIALS = [
  {
    name: 'Amara Diallo',
    role: 'Agricultural Coordinator · Senegal',
    quote: 'Before Agrovia, I was managing 60 fields over WhatsApp. Now I see everything in one place.',
    rating: 5,
  },
  {
    name: 'Kelvin Otieno',
    role: 'Field Agent · Kenya',
    quote: 'The mobile interface is fast even with poor network. Log updates and move on — no waiting.',
    rating: 5,
  },
  {
    name: 'Fatima Bah',
    role: 'Smallholder Coordinator · Guinea',
    quote: 'The at-risk alerts alone saved two of our maize fields this season. Game changer.',
    rating: 5,
  },
];

// Fixed variants with proper typing
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.23, 1, 0.32, 1] as const // Added 'as const' to fix the type
    } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function LandingPage() {
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 });
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.1 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.1 });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSlider />

      {/* Trust Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-neutral-100 py-5 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {['For farm coordinators', 'For field agents', 'Real-time dashboard', 'Crop lifecycle tracking'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-neutral-500">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Platform Features</p>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 leading-tight">
              Everything you need.
            </h2>
            <p className="mt-4 text-neutral-500 text-base max-w-2xl mx-auto">
              From field monitoring to harvest analytics — Agrovia gives your team a single source of truth.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group p-6 border border-neutral-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                  <Icon size={22} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Mini features */}
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {MINI_FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="p-4 bg-neutral-50 border border-neutral-100 flex gap-3 items-start"
              >
                <Icon size={18} className="text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" ref={stepsRef} className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900">
              Simple workflow. Powerful results.
            </h2>
          </motion.div>

          <div className="space-y-20">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial="hidden"
                animate={stepsInView ? "visible" : "hidden"}
                variants={fadeUp}
                transition={{ delay: i * 0.15 }}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center`}
              >
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-4">
                    <span className="text-7xl font-black text-emerald-600/20">{step.number}</span>
                    <div className="w-px h-10 bg-emerald-200" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step {step.number}</span>
                  </div>
                  <h3 className="text-3xl font-black text-neutral-900">{step.title}</h3>
                  <p className="text-neutral-500 text-base leading-relaxed max-w-md">{step.desc}</p>
                  <ul className="space-y-2">
                    {step.bullets.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-sm text-neutral-600">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <div className="relative overflow-hidden shadow-lg">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover aspect-video"
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - White background, subtle distinction */}
      <section id="stats" ref={statsRef} className="py-20 bg-white border-y border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Platform Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900">
              What Agrovia offers
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map(({ value, label, icon: Icon, description }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-neutral-100 flex items-center justify-center">
                    <Icon size={28} className="text-neutral-700" />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-black text-neutral-900">{value}</p>
                <p className="text-sm font-semibold text-neutral-700 mt-1">{label}</p>
                <p className="text-xs text-neutral-400 mt-1">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" ref={testimonialsRef} className="py-24 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900">Trusted by agricultural teams</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map(({ name, role, quote, rating }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="p-6 border border-neutral-100 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed mb-5">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                  <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-700">{name.charAt(0)}{name.split(' ')[1]?.charAt(0) || ''}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{name}</p>
                    <p className="text-xs text-neutral-500">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Emerald for uniformity */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-[0.3em] mb-4">Get Started</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Ready to transform your field monitoring?
            </h2>
            <p className="text-emerald-100 text-base mb-10 max-w-md mx-auto">
              Join Agrovia and start managing your fields with real-time data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/auth"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-600 hover:bg-emerald-50 text-sm font-bold transition-all"
              >
                Start Free
                <ArrowRight size={16} />
              </a>
              <a
                href="/auth"
                className="px-8 py-3.5 border border-white/30 hover:bg-white/10 text-white text-sm font-semibold transition-all"
              >
                Sign In
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}