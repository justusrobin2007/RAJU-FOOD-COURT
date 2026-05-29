'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Utensils, Instagram, Phone, MapPin, Clock, Mail, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { href: '/about',   label: 'About Us' },
  { href: '/menu',    label: 'Our Menu' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
];

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

function Accordion({ title, children }: AccordionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gold/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
      >
        <span className="font-playfair text-sm font-semibold text-gold">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 text-gold/60" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-4 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-charcoal-dark border-t border-gold/10 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 ambient-glow-maroon rounded-full pointer-events-none filter blur-3xl opacity-20" />
      <div className="absolute top-0 left-0 w-80 h-80 ambient-glow-saffron rounded-full pointer-events-none filter blur-3xl opacity-10" />

      <div className="max-w-7xl mx-auto px-5 relative z-10">

        {/* ── Desktop layout (lg+) ── */}
        <div className="hidden lg:grid grid-cols-4 gap-10 py-14">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Utensils className="w-5 h-5 text-saffron" />
              <span className="font-playfair text-lg font-bold tracking-wider text-cream group-hover:text-saffron transition-colors duration-200">
                RAJU FOOD COURT
              </span>
            </Link>
            <p className="text-sm text-cream/55 leading-relaxed font-light">
              Serving fresh, pure vegetarian meals in Rajkot since 1996. From a humble rolling cart to a landmark food destination.
            </p>
            <a
              href="https://www.instagram.com/rajufoodcourt?igsh=MXdpOXNhNnUycnAzaQ=="
              target="_blank" rel="noreferrer"
              className="w-9 h-9 inline-flex items-center justify-center border border-gold/20 rounded-full text-cream/60 hover:border-saffron hover:text-saffron transition-all duration-200"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-playfair text-base font-semibold text-gold">Opening Hours</h4>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-cream">Monday – Sunday</p>
                <p className="text-xs text-cream/45 mt-0.5">6:00 PM – 11:00 PM</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-playfair text-base font-semibold text-gold">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-cream/55 hover:text-saffron transition-colors duration-200 font-light">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-playfair text-base font-semibold text-gold">Find Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <span className="text-sm text-cream/55 font-light leading-relaxed">
                  No 3/8, Gayakwadi Main Rd, Near Mangalam Ice Gola, Junction Plot, Rajkot, Gujarat – 360001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-saffron shrink-0" />
                <span className="text-sm text-cream/55 font-light">+91 91064 65658</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-saffron shrink-0" />
                <span className="text-sm text-cream/55 font-light">rajufoodcourt007@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Mobile layout (< lg) ── */}
        <div className="lg:hidden pt-6 pb-2">

          {/* Brand always visible */}
          <div className="flex items-center justify-between mb-5">
            <Link href="/" className="flex items-center gap-2 group">
              <Utensils className="w-4 h-4 text-saffron" />
              <span className="font-playfair text-base font-bold tracking-wider text-cream">RAJU FOOD COURT</span>
            </Link>
            <a
              href="https://www.instagram.com/rajufoodcourt?igsh=MXdpOXNhNnUycnAzaQ=="
              target="_blank" rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center border border-gold/20 rounded-full text-cream/60 hover:border-saffron hover:text-saffron transition-all"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs text-cream/45 font-light leading-relaxed mb-5">
            Serving fresh, pure vegetarian meals in Rajkot since 1996.
          </p>

          {/* Accordion sections */}
          <Accordion title="Opening Hours">
            <div className="flex items-start gap-3">
              <Clock className="w-3.5 h-3.5 text-saffron shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-cream">Monday – Sunday</p>
                <p className="text-xs text-cream/45 mt-0.5">6:00 PM – 11:00 PM</p>
              </div>
            </div>
          </Accordion>

          <Accordion title="Quick Links">
            <div className="flex flex-col gap-2">
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-cream/55 hover:text-saffron transition-colors font-light">
                  {label}
                </Link>
              ))}
            </div>
          </Accordion>

          <Accordion title="Find Us">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-3.5 h-3.5 text-saffron shrink-0 mt-0.5" />
                <span className="text-xs text-cream/55 font-light leading-relaxed">
                  No 3/8, Gayakwadi Main Rd, Near Mangalam Ice Gola, Junction Plot, Rajkot, Gujarat – 360001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-saffron shrink-0" />
                <span className="text-xs text-cream/55 font-light">+91 91064 65658</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 text-saffron shrink-0" />
                <span className="text-xs text-cream/55 font-light">rajufoodcourt007@gmail.com</span>
              </li>
            </ul>
          </Accordion>
        </div>

        {/* ── Copyright — always visible ── */}
        <div className="border-t border-gold/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/30 font-light">
          <p>© {new Date().getFullYear()} Raju Food Court. All rights reserved.</p>
          <p>Rajkot, Gujarat</p>
        </div>
      </div>
    </footer>
  );
}
