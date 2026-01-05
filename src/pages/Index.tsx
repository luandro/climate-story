import { LanguageProvider } from '@/contexts/LanguageContext';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgressIndicator } from '@/components/ui/scroll-progress-indicator';
import { Act1Scrollytelling } from '@/components/act1';

function ClimateJourneyContent() {
  return (
    <div className="relative bg-black">
      <ScrollProgressIndicator />

      <main id="main-content">
        {/* Act 1: Diagnosis - "Onde estamos?" */}
        <Act1Scrollytelling />

        {/* Placeholder for future acts - to be implemented */}
        <section className="min-h-screen bg-[#171717] text-white flex items-center justify-center">
          <div className="text-center px-6 opacity-50">
            <p className="text-lg text-white/50">
              Acts 2–4 coming soon...
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function Index() {
  return (
    <LanguageProvider>
      <ClimateJourneyContent />
    </LanguageProvider>
  );
}
