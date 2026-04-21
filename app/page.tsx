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
  Star,
  MapPin,
  Bell,
  BarChart3,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Activity,
    title: 'Real-Time Field Monitoring',
    desc: 'Track every field\'s health, stage, and activity as it happens. One unified dashboard for coordinators and agents.',
    accent: 'emerald',
  },
  {
    icon: Shield,
    title: 'Automatic Risk Detection',
    desc: 'Agrovia flags fields that have been neglected or overdue — before losses occur. Stay ahead of every harvest cycle.',
    accent: 'amber',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First for Field Agents',
    desc: 'Optimized for field-ready use. Agents log updates, observations, and stage changes right from the land.',
    accent: 'sky',
  },
  {
    icon: Users,
    title: 'Multi-Agent Coordination',
    desc: 'Assign fields, track agent performance, and synchronize your team across regions without a single phone call.',
    accent: 'violet',
  },
  {
    icon: TrendingUp,
    title: 'Stage-by-Stage Insights',
    desc: 'From planting to harvest, every transition is timestamped — giving you a complete crop lifecycle view.',
    accent: 'rose',
  },
  {
    icon: Globe,
    title: 'Built for African Agriculture',
    desc: 'Designed around local farming cycles, regional crop types, and the realities of smallholder coordination.',
    accent: 'orange',
  },
];

const MINI_FEATURES = [
  { icon: MapPin,   title: 'GPS Field Mapping',      desc: 'Pin exact field locations with coordinates.' },
  { icon: Bell,     title: 'Smart Alerts',            desc: 'Get notified the moment a field goes at risk.' },
  { icon: BarChart3, title: 'Harvest Analytics',     desc: 'Track yield trends across seasons and regions.' },
  { icon: CheckCircle2, title: 'Stage Checklists',   desc: 'Ensure every growth milestone is confirmed.' },
];

const STEPS = [
  {
    number: '01',
    title: 'Coordinators set up fields',
    desc: 'Add your fields with crop type, planting date, and location. Assign them to field agents in seconds.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
    bullets: ['Bulk field import via CSV', 'Auto-assign by region', 'Set custom harvest windows'],
  },
  {
    number: '02',
    title: 'Agents log updates in the field',
    desc: 'Field agents use the mobile-ready interface to record observations, stage changes, and risk flags directly from the farm.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&q=80',
    bullets: ['Works offline on mobile', 'Photo notes with captions', 'One-tap stage progression'],
  },
  {
    number: '03',
    title: 'Coordinators monitor everything',
    desc: 'Dashboard shows real-time status across all fields. At-risk alerts surface automatically. Nothing falls through the cracks.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80',
    bullets: ['Live activity feed', 'At-risk field priority view', 'Agent performance reports'],
  },
];

const STATS = [
  { value: '2,400+', label: 'Fields monitored',      sub: 'Across 12 countries' },
  { value: '180+',   label: 'Field agents active',   sub: 'Updated in real time' },
  { value: '94%',    label: 'On-time harvest rate',  sub: 'Up from 71% baseline' },
  { value: '3.2×',   label: 'Faster issue response', sub: 'vs. manual tracking' },
];

const TESTIMONIALS = [
  {
    name: 'Amara Diallo',
    role: 'Agricultural Coordinator · Senegal',
    avatar: 'AD',
    quote: 'Before Agrovia, I was managing 60 fields over WhatsApp. Now I see everything in one place and my agents actually update on time.',
    rating: 5,
  },
  {
    name: 'Kelvin Otieno',
    role: 'Field Agent · Kenya',
    avatar: 'KO',
    quote: 'The mobile app is fast even with poor network. I can log a field update and move on — no waiting, no confusion.',
    rating: 5,
  },
  {
    name: 'Fatima Bah',
    role: 'Smallholder Coordinator · Guinea',
    avatar: 'FB',
    quote: 'The at-risk alerts alone saved two of our maize fields this season. We caught the problem 3 weeks before harvest.',
    rating: 5,
  },
];

const accentMap: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
  amber:   'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  sky:     'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
  violet:  'bg-violet-50 text-violet-600 group-hover:bg-violet-100',
  rose:    'bg-rose-50 text-rose-600 group-hover:bg-rose-100',
  orange:  'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── 1. HERO ── */}
      <HeroSlider />

      {/* ── 2. TRUST BAR ── */}
      <section className="border-y border-neutral-100 py-5 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {['Trusted by 180+ agents across Africa', '12 countries', 'Zero data loss since launch', 'ISO-ready audit logs'].map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm text-neutral-500">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. FEATURES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">Platform Features</p>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 leading-tight">
              Everything your team needs.<br className="hidden md:block" /> Nothing it doesn&apos;t.
            </h2>
            <p className="mt-4 text-neutral-500 text-base md:text-lg max-w-xl mx-auto">
              Agrovia gives agricultural coordinators and field agents a shared operating picture — from a single seed to a full harvest.
            </p>
          </div>

          {/* Main 6 feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, accent }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all duration-200 bg-white cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-200 ${accentMap[accent]}`}>
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-bold text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Mini feature row */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {MINI_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex gap-3 items-start">
                <Icon size={16} className="text-emerald-600 mt-0.5 shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-[13px] font-bold text-neutral-800">{title}</p>
                  <p className="text-[12px] text-neutral-400 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">How It Works</p>
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
                <div className="flex-1 space-y-5">
                  {/* Step number — large, visible, bold */}
                  <div className="flex items-center gap-4">
                    <span className="text-[80px] font-black leading-none text-emerald-600/20 select-none">
                      {step.number}
                    </span>
                    <div className="w-px h-12 bg-emerald-200" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Step {step.number}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-neutral-900 -mt-2">{step.title}</h3>
                  <p className="text-neutral-500 text-base leading-relaxed max-w-md">{step.desc}</p>
                  <ul className="space-y-2.5">
                    {step.bullets.map((pt) => (
                      <li key={pt} className="flex items-center gap-2.5 text-sm text-neutral-700">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className="flex-1 w-full">
                  <div className="relative rounded-2xl overflow-hidden aspect-video shadow-xl ring-1 ring-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {/* Step badge on image */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-neutral-700">Step {step.number}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. STATS ── */}
      <section id="stats" className="py-24 bg-emerald-600 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-200 text-xs font-bold uppercase tracking-[0.25em] mb-3">By the Numbers</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Results that speak for themselves</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label, sub }) => (
              <div key={label} className="flex flex-col gap-1">
                <p className="text-4xl md:text-5xl font-black text-white">{value}</p>
                <p className="text-white text-sm font-semibold">{label}</p>
                <p className="text-emerald-300 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900">Heard from the field</h2>
            <p className="mt-3 text-neutral-500 text-base max-w-md mx-auto">
              Coordinators and agents across Africa share how Agrovia changed their season.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, avatar, quote, rating }) => (
              <div key={name} className="flex flex-col gap-5 p-6 rounded-2xl border border-neutral-100 bg-white hover:shadow-md transition-shadow duration-200">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-neutral-50">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-emerald-700">{avatar}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-neutral-900">{name}</p>
                    <p className="text-[11px] text-neutral-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA ── */}
      <section className="relative py-28 overflow-hidden">
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
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">Get Started Today</p>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
            Your fields deserve<br /> better oversight.
          </h2>
          <p className="text-neutral-300 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join agricultural teams already using Agrovia to monitor crops, coordinate agents, and protect their harvests.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/auth?mode=register"
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/40"
            >
              Create Free Account
              <ArrowRight size={16} />
            </a>
            <a
              href="/auth?mode=login"
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