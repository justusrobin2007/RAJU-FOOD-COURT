'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Clock, Mail, CheckCircle, ArrowUpRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const INFO = [
  {
    Icon: MapPin,
    title: 'Address',
    lines: ['No 3/8, Gayakwadi Main Rd,', 'Near Mangalam Ice Gola, Gayakwadi,', 'Junction Plot, Rajkot, Gujarat – 360001'],
  },
  {
    Icon: Phone,
    title: 'Phone',
    lines: ['+91 91064 65658'],
  },
  {
    Icon: Clock,
    title: 'Opening Hours',
    lines: ['Monday – Sunday: 6:00 PM – 11:00 PM'],
  },
  {
    Icon: Mail,
    title: 'Email',
    lines: ['rajufoodcourt007@gmail.com'],
  },
];

export default function Contact() {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [msg, setMsg]             = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;

    const phone    = process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/[^0-9]/g, '') || '919486633017';
    const emailLine = email.trim() ? `Email: ${email.trim()}\n` : '';
    const text     = `Hello Raju Food Court,\n\nName: ${name}\n${emailLine}\nMessage:\n${msg}\n\nRegards,\n${name}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');

    setSubmitted(true);
    setName(''); setEmail(''); setMsg('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-20 pb-16 bg-charcoal md:pt-28 md:pb-24 md:min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] ambient-glow-saffron rounded-full filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] ambient-glow-maroon rounded-full filter blur-3xl opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-gold font-semibold mb-3 block">
            Get in Touch
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-playfair text-4xl md:text-6xl font-bold text-cream">
            Contact Raju Food Court
          </motion.h1>
          <motion.div variants={fadeUp} className="section-divider mt-5" />
        </motion.div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Info */}
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="space-y-8"
          >
            <motion.div variants={fadeUp}>
              <h2 className="font-playfair text-2xl font-bold text-cream mb-3">Find Us</h2>
              <p className="text-sm text-cream/60 font-light leading-relaxed">
                We are located in the heart of Rajkot. Come visit us for a fresh, delicious vegetarian meal. We welcome walk-ins and are open every evening.
              </p>
            </motion.div>

            <div className="space-y-5">
              {INFO.map(({ Icon, title, lines }) => (
                <motion.div key={title} variants={fadeUp} className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-saffron" />
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-cream text-sm mb-1">{title}</h4>
                    {lines.map((l) => (
                      <p key={l} className="text-xs text-cream/60 font-light leading-relaxed">{l}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="glassmorphism p-8 rounded-2xl"
          >
            <h3 className="font-playfair text-xl font-bold text-cream mb-6">Send Us A Message</h3>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-leaf/10 border border-leaf/30 text-xs p-4 rounded-xl mb-5 flex items-start gap-2.5"
                >
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-leaf-light" />
                  <div>
                    <p className="font-semibold text-cream">Message Sent via WhatsApp!</p>
                    <p className="mt-0.5 text-cream/60 font-light">We'll get back to you shortly.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleMessage} className="space-y-4">
              {[
                { label: 'Your Name',              type: 'text',  val: name,  set: setName,  ph: 'Enter your name',  req: true  },
                { label: 'Email Address (Optional)', type: 'email', val: email, set: setEmail, ph: 'Enter your email', req: false },
              ].map(({ label, type, val, set, ph, req }) => (
                <div key={label}>
                  <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-1.5">{label}</label>
                  <input
                    type={type} required={req} value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder={ph}
                    className="form-input"
                  />
                </div>
              ))}

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-1.5">Message</label>
                <textarea
                  required rows={4} value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Tell us how we can help..."
                  className="form-input resize-none"
                />
              </div>

              <button type="submit" className="btn-premium-filled w-full py-3 rounded-xl text-xs mt-2">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="glassmorphism p-8 rounded-3xl max-w-3xl mx-auto mb-16"
        >
          <div className="space-y-6 text-center">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-cream tracking-tight">
                Enjoyed dining with us?
              </h2>
              <p className="mt-3 text-sm text-cream/60 max-w-xl mx-auto">
                Your Google review helps other food lovers discover us.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/search?q=Raju+Food+Court+Rajkot+reviews', '_blank')}
              className="btn-premium-filled inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-[0.18em] mx-auto"
            >
              <ArrowUpRight className="w-4 h-4" />
              Write a Google Review
            </button>
          </div>
        </motion.div>

        {/* Map — exact Raju Food Court location */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="w-full h-80 rounded-2xl overflow-hidden border border-gold/12 shadow-2xl"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.076189894435!2d70.79976849011649!3d22.312958120456177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c9d50685d659%3A0xc2384019568c3b66!2sRAJU%20FOOD%20COURT!5e0!3m2!1sen!2sin!4v1780050264719!5m2!1sen!2sin"
            width="100%" height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(95%)' }}
            allowFullScreen={false} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

      </div>
    </div>
  );
}
