import { useTranslation } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-12 px-6 border-t border-border bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-display text-lg font-semibold mb-2">
              {t.footer.sources}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t.footer.sourcesNote}
            </p>
          </div>
          
          <div className="md:text-right">
            <p className="text-sm text-muted-foreground">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
