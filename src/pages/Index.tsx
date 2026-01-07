import { LanguageProvider, useTranslation } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgressIndicator } from '@/components/ui/scroll-progress-indicator';
import { Act1Scrollytelling } from '@/components/act1';
import { Act2Scrollytelling } from '@/components/act2';

function ClimateJourneyContent() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <ScrollProgressIndicator />
      <Header />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-doc-dark-bg text-doc-dark-fg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              {t.meta.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in-up" style={{ animationDelay: '200ms' }}>
              {t.meta.description}
            </p>
            <div className="mt-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="w-6 h-10 border-2 border-foreground/30 rounded-full mx-auto flex justify-center">
                <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* Act 1: Diagnosis - "Onde estamos?" */}
        <Act1Scrollytelling />

        {/* Act 2: Anatomy of the Problem - "De onde isso tudo vem?" */}
        <Act2Scrollytelling />

        {/* Placeholder for future acts - to be implemented */}
        <section className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
          <div className="text-center px-6 opacity-50">
            <p className="text-lg text-white/50">
              Acts 3–4 coming soon...
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
