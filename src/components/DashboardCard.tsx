
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  value?: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DashboardCard({
  title,
  icon,
  value,
  trend,
  footer,
  children,
  className,
  onClick
}: DashboardCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 card-hover", 
        onClick && "cursor-pointer", 
        className
      )}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        
        {value && (
          <div className="flex items-baseline">
            <div className="text-xl font-bold">{value}</div>
            
            {trend && (
              <div className={cn(
                "ml-2 text-sm font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </div>
            )}
          </div>
        )}
        
        {children}
      </div>
      
      {footer && (
        <div className="bg-muted/50 px-4 py-2 text-sm">
          {footer}
        </div>
      )}
    </Card>
  );
}
