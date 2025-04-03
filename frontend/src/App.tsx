// App.tsx
import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MissionSection } from './components/MissionSection';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Background3D } from './components/Background3D';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner'; // Import Toaster

export function App() {
  return (
    <ThemeProvider>
      {/* Add Toaster here - position/style as desired */}
      <Toaster position="top-center" richColors theme="dark" />
      <div className="relative min-h-screen bg-gray-950 text-white">
        <Background3D />
        <div className="relative z-10">
          <Header />
          {/* Use main tag correctly */}
          <main>
            <Hero />
            <AboutSection />
            <MissionSection />
            <PricingSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}