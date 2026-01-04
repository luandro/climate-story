import { LanguageProvider, useTranslation } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgressIndicator } from '@/components/ui/scroll-progress-indicator';
import { StorySection } from '@/components/story/StorySection';
import { StickyStage } from '@/components/story/StickyStage';
import { NarrativeBlock } from '@/components/story/NarrativeBlock';
import { ScrollImage } from '@/components/story/ScrollImage';
import { ClimateStripesPlaceholder } from '@/components/dataviz/ClimateStripesPlaceholder';
import { TemperatureGaugePlaceholder } from '@/components/dataviz/TemperatureGaugePlaceholder';
import { SankeyPlaceholder } from '@/components/dataviz/SankeyPlaceholder';
import { GoalTrackerPlaceholder } from '@/components/dataviz/GoalTrackerPlaceholder';
import { CompareToggle } from '@/components/interaction/CompareToggle';
import { SolutionCardsGrid } from '@/components/interaction/SolutionCard';
import { ImpactSandboxPlaceholder } from '@/components/interaction/ImpactSandboxPlaceholder';
import { AutoPlayVideoSection } from '@/components/video/AutoPlayVideoSection';
import { ScrollScrubVideo } from '@/components/video/ScrollScrubVideo';

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

        {/* Act 1: Diagnosis */}
        <StorySection id="act-1-diagnosis" theme="dark">
          <StickyStage>
            <ScrollImage
              src="/assets/demo/earth.png"
              alt={t.acts.act1.title}
              animation="fade"
            />
          </StickyStage>
          
          <div className="relative z-10">
            {/* Title block */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center px-6">
                <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
                  Act I
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {t.acts.act1.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t.acts.act1.subtitle}
                </p>
              </div>
            </div>
            
            {/* Narrative 1 */}
            <NarrativeBlock
              heading={t.acts.act1.narratives[0].heading}
              body={t.acts.act1.narratives[0].body}
              alignment="left"
              animation="slide-left"
            />
            
            {/* Narrative 2 with Climate Stripes */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full">
                <NarrativeBlock
                  heading={t.acts.act1.narratives[1].heading}
                  body={t.acts.act1.narratives[1].body}
                  alignment="center"
                  animation="fade"
                />
                <div className="mt-8">
                  <ClimateStripesPlaceholder />
                </div>
              </div>
            </div>
            
            {/* Narrative 3 */}
            <NarrativeBlock
              heading={t.acts.act1.narratives[2].heading}
              body={t.acts.act1.narratives[2].body}
              alignment="right"
              animation="slide-right"
            />
          </div>
        </StorySection>

        {/* Act 2: Causes */}
        <StorySection id="act-2-causes" theme="dark">
          <StickyStage>
            <ScrollImage
              src="/assets/demo/industry.png"
              alt={t.acts.act2.title}
              animation="slide-left"
            />
          </StickyStage>
          
          <div className="relative z-10">
            {/* Title block */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center px-6">
                <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
                  Act II
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {t.acts.act2.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t.acts.act2.subtitle}
                </p>
              </div>
            </div>
            
            {/* Narrative 1 */}
            <NarrativeBlock
              heading={t.acts.act2.narratives[0].heading}
              body={t.acts.act2.narratives[0].body}
              alignment="left"
              animation="slide-left"
            />
            
            {/* Narrative 2 with Sankey */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full">
                <NarrativeBlock
                  heading={t.acts.act2.narratives[1].heading}
                  body={t.acts.act2.narratives[1].body}
                  alignment="center"
                  animation="fade"
                />
                <div className="mt-8">
                  <SankeyPlaceholder />
                </div>
              </div>
            </div>
            
            {/* Narrative 3 with Video */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full max-w-4xl mx-auto px-6">
                <NarrativeBlock
                  heading={t.acts.act2.narratives[2].heading}
                  body={t.acts.act2.narratives[2].body}
                  alignment="center"
                  animation="fade"
                />
                <div className="mt-8">
                  <AutoPlayVideoSection />
                </div>
              </div>
            </div>
          </div>
        </StorySection>

        {/* Act 3: Solutions */}
        <StorySection id="act-3-solutions" theme="light">
          <StickyStage>
            <ScrollImage
              src="/assets/demo/renewable.png"
              alt={t.acts.act3.title}
              animation="slide-right"
            />
          </StickyStage>
          
          <div className="relative z-10">
            {/* Title block */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center px-6">
                <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
                  Act III
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {t.acts.act3.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t.acts.act3.subtitle}
                </p>
              </div>
            </div>
            
            {/* Narrative 1 */}
            <NarrativeBlock
              heading={t.acts.act3.narratives[0].heading}
              body={t.acts.act3.narratives[0].body}
              alignment="left"
              animation="slide-left"
            />
            
            {/* Narrative 2 with Compare Toggle */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full">
                <NarrativeBlock
                  heading={t.acts.act3.narratives[1].heading}
                  body={t.acts.act3.narratives[1].body}
                  alignment="center"
                  animation="fade"
                />
                <div className="mt-8">
                  <CompareToggle />
                </div>
              </div>
            </div>
            
            {/* Narrative 3 with Solution Cards */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full">
                <NarrativeBlock
                  heading={t.acts.act3.narratives[2].heading}
                  body={t.acts.act3.narratives[2].body}
                  alignment="center"
                  animation="fade"
                />
                <div className="mt-8">
                  <SolutionCardsGrid />
                </div>
              </div>
            </div>
          </div>
        </StorySection>

        {/* Act 4: Path Forward */}
        <StorySection id="act-4-path-forward" theme="neutral">
          <div className="relative z-10">
            {/* Title block */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center px-6">
                <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
                  Act IV
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {t.acts.act4.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t.acts.act4.subtitle}
                </p>
              </div>
            </div>
            
            {/* Narrative 1 with Goal Tracker */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full max-w-4xl mx-auto px-6">
                <NarrativeBlock
                  heading={t.acts.act4.narratives[0].heading}
                  body={t.acts.act4.narratives[0].body}
                  alignment="center"
                  animation="fade"
                />
                <div className="mt-8 flex justify-center">
                  <GoalTrackerPlaceholder />
                </div>
              </div>
            </div>
            
            {/* Narrative 2 with Impact Sandbox */}
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full max-w-4xl mx-auto px-6">
                <NarrativeBlock
                  heading={t.acts.act4.narratives[1].heading}
                  body={t.acts.act4.narratives[1].body}
                  alignment="center"
                  animation="fade"
                />
                <div className="mt-8">
                  <ImpactSandboxPlaceholder />
                </div>
              </div>
            </div>
            
            {/* Narrative 3 with Scroll Scrub Video */}
            <div className="relative">
              <div className="sticky top-1/2 -translate-y-1/2 z-10 pointer-events-none py-20">
                <NarrativeBlock
                  heading={t.acts.act4.narratives[2].heading}
                  body={t.acts.act4.narratives[2].body}
                  alignment="center"
                  animation="fade"
                />
              </div>
              <ScrollScrubVideo />
            </div>
            
            {/* Temperature Gauge */}
            <div className="min-h-screen flex items-center justify-center">
              <TemperatureGaugePlaceholder />
            </div>
          </div>
        </StorySection>
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
