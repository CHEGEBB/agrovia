import Link from 'next/link';
import Image from 'next/image';

const PRODUCT_LINKS = ['Features', 'How It Works', 'Sign In', 'Register'];
const LEGAL_LINKS   = ['Privacy Policy', 'Terms of Use'];

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Image
                src="/logo.png"
                alt="Agrovia"
                width={30}
                height={30}
                className="rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-white font-black text-base tracking-tight">Agrovia</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-neutral-500">
              A field monitoring platform built for modern agricultural coordination across Africa and beyond.
            </p>
            {/* Subtle tagline chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Live monitoring active</span>
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-3 md:col-start-7">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-4">Product</p>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l}>
                  <Link
                    href={l === 'Sign In' ? '/login' : l === 'Register' ? '/register' : `#${l.toLowerCase().replace(' ', '-')}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-4">Legal</p>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-sm hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Agrovia. All rights reserved.
          </p>
          <p className="text-xs text-neutral-700">
            Built with Next.js · Tailwind CSS · Appwrite
          </p>
        </div>
      </div>
    </footer>
  );
}