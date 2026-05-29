'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UtensilsCrossed, SlidersHorizontal, X } from 'lucide-react';
import MenuCard from '@/components/MenuCard';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const CATEGORIES = [
  'All',
  'Classic Dosa', 'Rava Specials', 'Uttapam', 'Family Dosa',
  'Fusion Dosa', 'Fry Varieties',
  'Idli & Vada',
  'Rice & Pulav', 'Rice & Biryani',
  'Pav Bhaji',
  'Paneer Special', 'Veg Special', 'Special Sabji', 'Kofta',
  'Roti & Naan', 'Dal',
  'Beverages', 'Desserts', 'Extras',
];

export default function Menu() {
  const [allItems, setAllItems]                 = useState<any[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery]           = useState('');
  const [sidebarOpen, setSidebarOpen]           = useState(false);
  const [, startTransition]                     = useTransition();

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setAllItems(data))
      .catch(() => setAllItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = allItems.filter((item) => {
    const matchesCat    = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectCategory = (cat: string) => {
    startTransition(() => setSelectedCategory(cat));
    setSidebarOpen(false);
  };

  return (
    <div className="pt-20 pb-16 bg-charcoal md:pt-28 md:pb-24 md:min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] ambient-glow-saffron rounded-full filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] ambient-glow-maroon rounded-full filter blur-3xl opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold mb-3 block">
            Premium South Indian Cuisine
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-playfair text-4xl md:text-6xl font-bold text-cream">
            Our Traditional Menu
          </motion.h1>
          <motion.div variants={fadeUp} className="section-divider mt-5" />
        </motion.div>

        {/* ── Search bar (full width, standalone) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 glassmorphism rounded-xl border border-gold/15 text-cream/60 hover:text-saffron hover:border-saffron/40 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>

          {/* Search input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-cream/35" />
            </div>
            <input
              type="text"
              placeholder="Search dishes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-11 rounded-xl w-full"
              style={{ paddingLeft: '2.75rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-cream/30 hover:text-cream/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Result count */}
          {!loading && (
            <span className="hidden md:block text-xs text-cream/35 font-light shrink-0 whitespace-nowrap">
              {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
            </span>
          )}
        </motion.div>

        {/* ── Main layout: sidebar + grid ── */}
        <div className="flex gap-8 items-start">

          {/* ── Category Sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`
              lg:block lg:w-52 shrink-0
              ${sidebarOpen ? 'block' : 'hidden'}
              lg:sticky lg:top-28
            `}
          >
            <div className="glassmorphism rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold mb-4 px-1">
                Categories
              </p>
              <nav className="space-y-0.5">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  const count  = cat === 'All'
                    ? allItems.length
                    : allItems.filter((i) => i.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => selectCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer group ${
                        active
                          ? 'bg-saffron/15 text-saffron border border-saffron/25'
                          : 'text-cream/55 hover:text-cream hover:bg-white/4 border border-transparent'
                      }`}
                    >
                      <span className="text-xs font-medium leading-tight">{cat}</span>
                      <span className={`text-[10px] font-mono shrink-0 ml-2 ${active ? 'text-saffron/70' : 'text-cream/25 group-hover:text-cream/40'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.aside>

          {/* ── Items Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Active category label */}
            {selectedCategory !== 'All' && (
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-playfair text-xl font-bold text-cream">{selectedCategory}</h2>
                <button
                  onClick={() => selectCategory('All')}
                  className="flex items-center gap-1 text-[10px] text-cream/40 hover:text-saffron transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glassmorphism rounded-2xl overflow-hidden animate-pulse">
                    <div className="bg-charcoal-light/40 aspect-video" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gold/10 rounded w-3/4" />
                      <div className="h-3 bg-gold/10 rounded w-full" />
                      <div className="h-3 bg-gold/10 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-24 border border-gold/8 bg-charcoal-light/10 rounded-2xl">
                <UtensilsCrossed className="w-12 h-12 text-cream/15 mx-auto mb-4" />
                <p className="font-playfair text-xl font-bold text-cream/40 mb-2">
                  {allItems.length === 0 ? 'Menu Coming Soon' : 'No dishes found'}
                </p>
                <p className="text-sm text-cream/30 font-light">
                  {allItems.length === 0
                    ? 'Our menu is being set up. Please check back soon.'
                    : 'Try a different search or category.'}
                </p>
              </div>
            ) : (
              <motion.div
                variants={stagger} initial="hidden" animate="show" layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id} layout variants={fadeUp}
                      exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.3 }}
                    >
                      <MenuCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
