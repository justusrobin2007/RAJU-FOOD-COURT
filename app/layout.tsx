import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LoadingScreen from '@/components/LoadingScreen';
import ScrollAnimations from '@/components/ScrollAnimations';

export const metadata: Metadata = {
  title: 'Raju Food Court | Pure Vegetarian Restaurant in Rajkot',
  description: 'Raju Food Court — serving fresh, pure vegetarian meals in Rajkot since 1996. South Indian dosas, Punjabi curries, pav bhaji and more at Junction Plot, Rajkot.',
  keywords: 'Raju Food Court, Rajkot, Vegetarian Restaurant, Dosa, Pav Bhaji, Punjabi Food, South Indian, Junction Plot, Gujarat',
  openGraph: {
    title: 'Raju Food Court | Pure Vegetarian Restaurant in Rajkot',
    description: 'Serving fresh, pure vegetarian meals in Rajkot since 1996.',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=1200&auto=format&fit=crop',
      width: 1200,
      height: 630,
      alt: 'Raju Food Court Rajkot',
    }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-charcoal text-cream antialiased min-h-screen overflow-x-hidden">
        <LoadingScreen />
        <ScrollAnimations>
          <Navbar />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
          <WhatsAppButton />
        </ScrollAnimations>
      </body>
    </html>
  );
}
