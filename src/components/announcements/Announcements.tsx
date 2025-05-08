
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BellRing, TrendingUp, Calendar, AlertCircle } from "lucide-react";

// Mock announcement data - would be replaced with actual API integration
const ANNOUNCEMENTS = [
  { 
    id: '1',
    title: 'Quarterly Review',
    content: 'Quarterly reviews scheduled for the second week of September.',
    icon: 'bell'
  },
  { 
    id: '2',
    title: 'Employee Engagement Survey',
    content: 'Please complete the survey by August 29th.',
    icon: 'trending-up'
  }
];

// Map icon names to Lucide components
const iconMap = {
  'bell': BellRing,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'info': AlertCircle
};

export function Announcements() {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h2 className="section-title flex items-center mb-3">
          <AlertCircle className="h-5 w-5 mr-2 text-primary" />
          Announcements
        </h2>
        
        {ANNOUNCEMENTS.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No announcements at this time.
          </div>
        ) : (
          <div>
            {ANNOUNCEMENTS.map((announcement, index) => {
              // Get the icon component or default to BellRing
              const IconComponent = iconMap[announcement.icon] || BellRing;
              const isLast = index === ANNOUNCEMENTS.length - 1;
              
              return (
                <div key={announcement.id}>
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 ${
                      announcement.icon === 'trending-up' ? 'text-green-500' : 'text-amber-500'
                    } mt-0.5`} />
                    <div>
                      <h3 className="font-medium">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </div>
                  </div>
                  
                  {!isLast && <Separator className="my-3" />}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Announcements;
