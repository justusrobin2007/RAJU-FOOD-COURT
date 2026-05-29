'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Send } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function FloatingCart() {
  const isOpen = useCartStore((state) => state.isOpen);
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !pickupTime) {
      alert('Please fill in all takeaway details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          pickupTime,
          items,
          totalAmount: getTotalPrice(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create order database entry');
      }

      const itemsListText = items
        .map((item) => `- ${item.name} x ${item.quantity} (${formatPrice(item.price * item.quantity)})`)
        .join('\n');
      
      const textMessage = `*New Takeaway Order - Raju Madras Cafe*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Requested Pickup:* ${pickupTime}\n\n*Items Ordered:*\n${itemsListText}\n\n*Total Amount:* ${formatPrice(getTotalPrice())}\n\n*Please confirm preparation! Thank you!*`;

      const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+919876543210';
      const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMessage)}`;

      clearCart();
      setIsOpen(false);
      setName('');
      setPhone('');
      setPickupTime('');
      
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert('Error syncing to database. Redirecting directly to WhatsApp.');
      
      const itemsListText = items
        .map((item) => `- ${item.name} x ${item.quantity}`)
        .join('\n');
      const textMessage = `*Takeaway Order*\nName: ${name}\nPhone: ${phone}\nTime: ${pickupTime}\nItems:\n${itemsListText}\nTotal: ${formatPrice(getTotalPrice())}`;
      const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+919876543210';
      const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMessage)}`, '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-charcoal-dark border-l border-gold/15 flex flex-col h-full relative z-10 shadow-2xl"
          >
            <div className="p-6 border-b border-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-saffron" />
                <h2 className="font-playfair text-lg font-bold text-cream">Your Takeaway Cart</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 border border-gold/15 hover:border-saffron hover:text-saffron rounded-full transition-colors duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-12 h-12 text-cream/20 mb-3" />
                  <p className="text-sm text-cream/50">Your cart is currently empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-charcoal-light/35 border border-gold/10 rounded-xl items-center"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <h4 className="text-xs font-semibold text-cream line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-saffron font-mono mt-0.5">{formatPrice(item.price)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-0.5 border border-gold/20 hover:border-saffron rounded text-cream/70 hover:text-saffron transition-all cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-0.5 border border-gold/20 hover:border-saffron rounded text-cream/70 hover:text-saffron transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-cream/40 hover:text-saffron transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gold/15 bg-charcoal-light/10 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-cream/70">Subtotal Amount</span>
                  <span className="font-mono text-lg text-gold">{formatPrice(getTotalPrice())}</span>
                </div>

                <form onSubmit={handleCheckout} className="space-y-3">
                  <hr className="border-gold/10" />
                  
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-gold font-medium block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full bg-charcoal/80 border border-gold/15 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-saffron placeholder-cream/30"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-gold font-medium block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-charcoal/80 border border-gold/15 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-saffron placeholder-cream/30"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-gold font-medium block mb-1">Pickup Time</label>
                    <input
                      type="time"
                      required
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-charcoal/80 border border-gold/15 rounded-lg py-2 px-3 text-xs text-cream focus:outline-none focus:border-saffron"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-premium-filled py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest font-semibold mt-4 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    {isSubmitting ? 'Processing...' : 'Place Order & Send WhatsApp'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
