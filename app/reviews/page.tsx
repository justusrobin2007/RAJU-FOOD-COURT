'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ExternalLink, MessageSquarePlus, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────── */
interface Review { id: string; name: string; rating: number; comment: string; isApproved: boolean; createdAt: string; }
interface Pending { id: string; name: string; rating: number; comment: string; }

/* ─── Animation variants ─────────────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } } };
const fadeIn   = { hidden: { opacity: 0 },         show: { opacity: 1,       transition: { duration: 0.7 } } };
const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const staggerF = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

/* ─── Animated counter ───────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); } else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Luxury Review Card ─────────────────────────────────────── */
function ReviewCard({ review, index }: { review: Review | Pending; index: number }) {
  const isPending = !('isApproved' in review);
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,168,128,0.22)' }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      style={{
        background: 'rgba(14,14,14,0.82)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(197,168,128,0.14)',
        borderRadius: 20,
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Ambient glow on hover */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Decorative quote */}
      <div style={{ position: 'absolute', top: 16, right: 20, fontFamily: "'Playfair Display', serif", fontSize: '4.5rem', lineHeight: 1, color: 'rgba(197,168,128,0.05)', fontWeight: 700, userSelect: 'none', pointerEvents: 'none' }}>"</div>

      {isPending && (
        <div style={{ position: 'absolute', top: 14, right: 14, fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C5A880', background: 'rgba(197,168,128,0.1)', border: '1px solid rgba(197,168,128,0.2)', padding: '3px 10px', borderRadius: 100 }}>
          Pending Approval
        </div>
      )}

      <div>
        {/* Stars */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.05 + i * 0.06, type: 'spring', stiffness: 400 }}>
              <Star size={14} color={i < review.rating ? '#C5A880' : 'rgba(250,246,238,0.12)'} fill={i < review.rating ? '#C5A880' : 'transparent'} />
            </motion.div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: 'rgba(250,246,238,0.78)', lineHeight: 1.85, fontWeight: 300, fontStyle: 'italic', marginBottom: 22 }}>
          "{review.comment}"
        </p>
      </div>

      <div style={{ borderTop: '1px solid rgba(197,168,128,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, color: '#FAF6EE', marginBottom: 2 }}>{review.name}</p>
          {'createdAt' in review && (
            <p style={{ fontSize: '10px', color: 'rgba(250,246,238,0.3)' }}>
              {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '9px', color: '#C5A880', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <CheckCircle size={11} />
          Verified
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function Reviews() {
  const [reviews, setReviews]         = useState<Review[]>([]);
  const [pending, setPending]         = useState<Pending[]>([]);
  const [name, setName]               = useState('');
  const [rating, setRating]           = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment]         = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(0);
  const CARDS_PER_PAGE = 6;

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.ok ? r.json() : [])
      .then((d: any[]) => setReviews(d.filter((r) => r.isApproved)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment }),
      });
      if (res.ok) {
        const nr = await res.json();
        setPending((p) => [{ id: nr.id, name, rating, comment }, ...p]);
        setName(''); setComment(''); setRating(5);
      }
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
  const visible    = reviews.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);
  const avgRating  = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '4.5';

  return (
    <div style={{ background: '#0F0F0F', minHeight: 'auto', overflowX: 'hidden' }}>

      {/* ── Cinematic Hero Header ─────────────────────────────── */}
      <div className="review-hero">
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,0,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,25,20,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            style={{ display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.4em', color: '#C5A880', textTransform: 'uppercase', marginBottom: 16 }}
          >
            Guest Testimonials
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 700, color: '#FAF6EE', lineHeight: 1.1, marginBottom: 24 }}
          >
            Guest Experiences
          </motion.h1>

          {/* Rating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.2)', borderRadius: 100, padding: '10px 24px', marginBottom: 20 }}
          >
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} color="#C5A880" fill="#C5A880" />
              ))}
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#FAF6EE' }}>{avgRating}</span>
            <span style={{ width: 1, height: 16, background: 'rgba(197,168,128,0.3)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(250,246,238,0.55)', fontWeight: 500 }}>
              {reviews.length > 0 ? `${reviews.length} Verified Reviews` : '35+ Google Reviews'}
            </span>
          </motion.div>

          {/* Animated divider */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.4 }}
            style={{ width: 60, height: 2, background: 'linear-gradient(90deg, #FF7A00, #C5A880)', borderRadius: 2, margin: '0 auto' }}
          />
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div className="review-grid">

          {/* Left: Reviews */}
          <div>
            {/* Pending */}
            <AnimatePresence>
              {pending.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Clock size={14} color="#C5A880" />
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, color: '#C5A880' }}>
                      Your Submission{pending.length > 1 ? 's' : ''} — Pending Approval
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {pending.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#FAF6EE' }}>
                Verified Guest Reviews
              </h2>
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(197,168,128,0.2)', background: 'transparent', color: page === 0 ? 'rgba(250,246,238,0.2)' : '#FAF6EE', cursor: page === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(197,168,128,0.2)', background: 'transparent', color: page === totalPages - 1 ? 'rgba(250,246,238,0.2)' : '#FAF6EE', cursor: page === totalPages - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {[1,2,3,4].map((i) => (
                  <div key={i} style={{ background: 'rgba(18,18,18,0.8)', border: '1px solid rgba(197,168,128,0.1)', borderRadius: 20, padding: 28, animation: 'pulse 2s infinite' }}>
                    <div style={{ height: 12, background: 'rgba(197,168,128,0.08)', borderRadius: 6, width: '40%', marginBottom: 16 }} />
                    <div style={{ height: 10, background: 'rgba(197,168,128,0.06)', borderRadius: 6, width: '100%', marginBottom: 8 }} />
                    <div style={{ height: 10, background: 'rgba(197,168,128,0.06)', borderRadius: 6, width: '80%', marginBottom: 8 }} />
                    <div style={{ height: 10, background: 'rgba(197,168,128,0.06)', borderRadius: 6, width: '60%' }} />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ padding: '60px 24px', border: '1px solid rgba(197,168,128,0.08)', borderRadius: 20, textAlign: 'center' }}>
                <Quote size={32} color="rgba(197,168,128,0.2)" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'rgba(250,246,238,0.4)', marginBottom: 8 }}>No reviews yet</p>
                <p style={{ fontSize: '13px', color: 'rgba(250,246,238,0.25)', fontWeight: 300 }}>Be the first to share your experience!</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  variants={stagger} initial="hidden" animate="show"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}
                >
                  {visible.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
                </motion.div>
              </AnimatePresence>
            )}

          </div>

          {/* Right: Sticky form */}
          <motion.div
            className="review-sidebar"
            initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ position: 'sticky', top: 112 }}
          >
            <div style={{ background: 'rgba(14,14,14,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(197,168,128,0.16)', borderRadius: 24, padding: '32px', position: 'relative', overflow: 'hidden' }}>
              {/* Ambient glow */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, position: 'relative' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,122,0,0.1)', border: '1px solid rgba(255,122,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquarePlus size={16} color="#FF7A00" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#FAF6EE' }}>Share Your Experience</h3>
                  <p style={{ fontSize: '10px', color: 'rgba(250,246,238,0.4)', marginTop: 1 }}>Your review will appear after approval</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                {/* Name */}
                <div>
                  <label style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A880', display: 'block', marginBottom: 6 }}>Your Name</label>
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="form-input"
                  />
                </div>

                {/* Star rating */}
                <div>
                  <label style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A880', display: 'block', marginBottom: 10 }}>Your Rating</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const val = idx + 1;
                      const active = val <= (hoverRating || rating);
                      return (
                        <motion.button
                          key={idx} type="button"
                          whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(val)}
                          onMouseEnter={() => setHoverRating(val)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                        >
                          <Star size={24} color={active ? '#C5A880' : 'rgba(250,246,238,0.15)'} fill={active ? '#C5A880' : 'transparent'} style={{ filter: active ? 'drop-shadow(0 0 6px rgba(197,168,128,0.5))' : 'none', transition: 'all 0.2s' }} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A880', display: 'block', marginBottom: 6 }}>Your Review</label>
                  <textarea
                    required rows={4} value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience…"
                    className="form-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                <motion.button
                  type="submit" disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium-filled"
                  style={{ padding: '13px', borderRadius: 12, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: submitting ? 0.6 : 1 }}
                >
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </motion.button>
              </form>

              {/* Divider */}
              <div style={{ margin: '20px 0', borderTop: '1px solid rgba(197,168,128,0.1)' }} />

              {/* Review us on Google */}
              <a
                href="https://maps.app.goo.gl/4wtLr1Zn9rsvKBxT7"
                target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 12, border: '1px solid rgba(197,168,128,0.2)', color: '#C5A880', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s', background: 'transparent' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#FF7A00'; el.style.color = '#FF7A00'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(197,168,128,0.2)'; el.style.color = '#C5A880'; }}
              >
                <ExternalLink size={13} />
                Review us on Google
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
