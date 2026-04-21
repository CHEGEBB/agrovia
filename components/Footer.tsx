import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <span className="text-white font-black text-base">Agrovia</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            A field monitoring platform built for modern agricultural coordination across Africa and beyond.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Product</p>
          <ul className="space-y-2">
            {['Features', 'How It Works', 'Sign In', 'Register'].map((l) => (
              <li key={l}>
                <Link href="#" className="text-sm hover:text-white transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Legal</p>
          <ul className="space-y-2">
            {['Privacy Policy', 'Terms of Use'].map((l) => (
              <li key={l}>
                <Link href="#" className="text-sm hover:text-white transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800 px-5 md:px-8 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs">© {new Date().getFullYear()} Agrovia. All rights reserved.</p>
        <p className="text-xs">Built with Next.js · Tailwind CSS · Appwrite</p>
      </div>
    </footer>
  );
}