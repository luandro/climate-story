import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          aria-label={t.header.languageToggle}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium uppercase">
            {language === 'en' ? 'PT' : 'EN'}
          </span>
        </Button>
      </div>
      
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        {t.header.skipToContent}
      </a>
    </header>
  );
}
