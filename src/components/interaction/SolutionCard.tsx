import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { TreePine, Waves, Droplet, LucideIcon } from 'lucide-react';

interface SolutionCardProps {
  icon?: 'tree' | 'waves' | 'droplet';
  titleKey?: string;
  impactValue?: number;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  tree: TreePine,
  waves: Waves,
  droplet: Droplet,
};

export function SolutionCard({
  icon = 'tree',
  titleKey = 'Forests',
  impactValue = 30,
  className,
}: SolutionCardProps) {
  const { t } = useTranslation();
  const Icon = iconMap[icon] || TreePine;

  return (
    <div 
      className={cn(
        'group relative p-6 rounded-xl',
        'bg-card border border-border',
        'hover:shadow-lg hover:border-accent/50',
        'transition-all duration-300',
        'cursor-pointer',
        className
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      
      {/* Title */}
      <h4 className="font-display text-lg font-semibold mb-2">
        {titleKey}
      </h4>
      
      {/* Impact indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">
          {t.components.solutionCard.impact}:
        </span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${impactValue}%` }}
          />
        </div>
        <span className="text-sm font-medium text-accent">
          {impactValue}%
        </span>
      </div>
      
      {/* Learn more link */}
      <button className="text-sm text-primary hover:text-primary/80 font-medium">
        {t.components.solutionCard.learnMore} →
      </button>
    </div>
  );
}

interface SolutionCardsGridProps {
  cards?: Array<{
    id: string;
    icon: 'tree' | 'waves' | 'droplet';
    impactValue: number;
  }>;
  className?: string;
}

export function SolutionCardsGrid({ 
  cards = [
    { id: 'forests', icon: 'tree', impactValue: 30 },
    { id: 'oceans', icon: 'waves', impactValue: 25 },
    { id: 'wetlands', icon: 'droplet', impactValue: 15 },
  ],
  className 
}: SolutionCardsGridProps) {
  return (
    <div className={cn('grid md:grid-cols-3 gap-4 max-w-4xl mx-auto p-6', className)}>
      {cards.map((card) => (
        <SolutionCard
          key={card.id}
          icon={card.icon}
          titleKey={card.id.charAt(0).toUpperCase() + card.id.slice(1)}
          impactValue={card.impactValue}
        />
      ))}
    </div>
  );
}
