import { Navbar } from '@/components/Navbar';
import { HeroSlider } from '@/components/HeroSlider';
import { Footer } from '@/components/Footer';
import {
  Activity,
  Shield,
  Smartphone,
  Globe,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

// ─── Section 1: Hero (HeroSlider) ────────────────────────────────────────────
// ─── Section 2: Features ─────────────────────────────────────────────────────
// ─── Section 3: How It Works ─────────────────────────────────────────────────
// ─── Section 4: Stats ────────────────────────────────────────────────────────
// ─── Section 5: CTA ──────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Activity,
    title: 'Real-Time Field Monitoring',
    desc: 'Track every field&apos;s health, stage, and activity as it happens. One unified dashboard for coordinators and agents.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Automatic Risk Detection',
    desc: 'Agrovia flags fields that have been neglected or overdue — before losses occur. Stay ahead of every harvest cycle.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First for Field Agents',
    desc: 'Optimized for low-bandwidth, field-ready use. Agents log updates, observations, and stage changes right from the land.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Users,
    title: 'Multi-Agent Coordination',
    desc: 'Assign fields, track agent performance, and synchronize your team across regions without a single phone call.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: TrendingUp,
    title: 'Stage-by-Stage Insights',
    desc: 'From planting to harvest, every transition is timestamped and logged — giving you a complete crop lifecycle view.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Globe,
    title: 'Built for African Agriculture',
    desc: 'Designed around local farming cycles, regional crop types, and the realities of smallholder coordination across Africa.',
    color: 'bg-orange-50 text-orange-600',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Coordinators set up fields',
    desc: 'Add your fields with crop type, planting date, and location. Assign them to field agents in seconds.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  },
  {
    number: '02',
    title: 'Agents log updates in the field',
    desc: 'Field agents use the mobile-ready interface to record observations, stage changes, and risk flags directly from the farm.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
  },
  {
    number: '03',
    title: 'Coordinators monitor everything',
    desc: 'Dashboard shows real-time status across all fields. At-risk alerts surface automatically. Nothing falls through the cracks.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
  },
];

const STATS = [
  { value: '2,400+', label: 'Fields monitored' },
  { value: '180+',   label: 'Field agents active' },
  { value: '94%',    label: 'On-time harvest rate' },
  { value: '12',     label: 'Countries reached' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── 1. HERO ── */}
      <HeroSlider />

      {/* ── 2. FEATURES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">
              Platform Features
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 leading-tight">
              Everything your team needs.<br className="hidden md:block" /> Nothing it doesn&apos;t.
            </h2>
            <p className="mt-4 text-neutral-500 text-base md:text-lg max-w-xl mx-auto">
              Agrovia gives agricultural coordinators and field agents a shared operating picture — from a single seed to a full harvest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200`}>
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 leading-tight">
              Simple for agents.<br className="hidden md:block" /> Powerful for coordinators.
            </h2>
          </div>

          <div className="space-y-20">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16`}
              >
                {/* Text */}
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-3">
                    <span className="text-5xl font-black text-emerald-100">{step.number}</span>
                    <div className="w-px h-8 bg-neutral-200" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-neutral-900">{step.title}</h3>
                  <p className="text-neutral-500 text-base leading-relaxed max-w-md">{step.desc}</p>
                  <ul className="space-y-2">
                    {['Syncs in real time', 'Works offline on mobile', 'No training required'].map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-sm text-neutral-600">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className="flex-1 w-full">
                  <div className="relative rounded-2xl overflow-hidden aspect-video shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. STATS ── */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl md:text-5xl font-black text-white mb-1">{value}</p>
                <p className="text-emerald-200 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ── */}
      <section className="relative py-28 overflow-hidden">
        {/* Background crop image */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/80" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 text-center">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Get Started Today
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
            Your fields deserve<br /> better oversight.
          </h2>
          <p className="text-neutral-300 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join agricultural teams already using Agrovia to monitor crops, coordinate agents, and protect their harvests — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/40"
            >
              Create Free Account
              <ArrowRight size={16} />
            </a>
            <a
              href="/login"
              className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}