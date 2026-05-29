'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Utensils } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About' },
  { href: '/menu',    label: 'Menu' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname    = usePathname();
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}
    >
      <div className="max-w-6xl mx-auto px-5">
        <nav className={`flex items-center justify-between px-5 py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-charcoal/88 backdrop-blur-xl border border-gold/15 shadow-2xl'
            : 'bg-transparent border border-transparent'
        }`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Utensils className="w-4 h-4 text-saffron" />
            <span className="font-playfair text-base md:text-lg font-bold tracking-wider text-cream group-hover:text-saffron transition-colors duration-200">
              RAJU FOOD COURT
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-[11px] font-semibold tracking-widest uppercase relative py-1 transition-colors duration-200 ${
                    active ? 'text-saffron' : 'text-cream/60 hover:text-cream'
                  }`}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-saffron rounded"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full border border-gold/20 bg-white/4 text-cream hover:border-saffron hover:text-saffron transition-all duration-200 cursor-pointer"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="absolute top-full left-4 right-4 mt-2 bg-charcoal/95 backdrop-blur-xl border border-gold/15 rounded-2xl p-5 lg:hidden shadow-2xl"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block py-3 text-sm font-semibold tracking-widest uppercase border-b border-gold/8 last:border-0 transition-colors duration-200 ${
                  pathname === href ? 'text-saffron' : 'text-cream/65 hover:text-cream'
                }`}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
