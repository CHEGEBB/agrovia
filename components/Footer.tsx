'use client';

import Link from 'next/link';
import Image from 'next/image';

const FOOTER_LINKS = {
  Platform: [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  Legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="relative">
      {/* Background Image with Subtle Emerald Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2073&auto=format"
          alt="Agricultural landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark base overlay */}
        <div className="absolute inset-0 bg-neutral-950/70" />
        {/* Subtle emerald gradient - just a hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-emerald-950/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Agrovia"
                width={34}
                height={34}
                className="rounded-lg"
              />
              <span className="text-white font-bold text-xl tracking-tight">Agrovia</span>
            </Link>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
              Smarter field monitoring for modern agriculture.
              Real-time data, better harvests.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="md:col-span-2">
              <h3 className="text-neutral-300 text-sm font-semibold mb-4 tracking-wide">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 hover:text-emerald-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800/50 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} Agrovia. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-xs text-neutral-500 hover:text-emerald-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-xs text-neutral-500 hover:text-emerald-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-xs text-neutral-500 hover:text-emerald-400 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}