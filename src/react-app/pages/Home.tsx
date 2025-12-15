import { useEffect } from 'react';
import Navbar from '@/react-app/components/Navbar';
import Hero from '@/react-app/components/Hero';
import PlayersOnline from '@/react-app/components/PlayersOnline';
import PlayNow from '@/react-app/components/PlayNow';
import Links from '@/react-app/components/Links';
import Footer from '@/react-app/components/Footer';

export default function Home() {
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <PlayersOnline />
      <PlayNow />
      <Links />
      <Footer />
    </div>
  );
}
