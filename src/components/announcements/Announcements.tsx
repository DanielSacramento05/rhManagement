
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BellRing, TrendingUp, Calendar, AlertCircle, Users } from "lucide-react";
import { getAnnouncements, Announcement } from "@/services/announcementService";
import { getCurrentUser } from "@/services/authService";

// Map icon names to Lucide components
const iconMap = {
  'bell': BellRing,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'info': AlertCircle,
  'users': Users
};

export function Announcements() {
  const currentUser = getCurrentUser();
  
  // Fetch announcements for the current user
  const { data: announcementsData, isLoading, isError } = useQuery({
    queryKey: ['announcements', currentUser?.departmentId, currentUser?.role],
    queryFn: () => getAnnouncements(),
  });

  const announcements = announcementsData?.data || [];

  // Function to render announcement source based on role
  const renderAnnouncementSource = (announcement: Announcement) => {
    if (announcement.is_global) {
      return <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">Company-wide</span>;
    } else if (announcement.department_id) {
      return <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full px-2 py-0.5">Team</span>;
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h2 className="section-title flex items-center mb-3">
          <AlertCircle className="h-5 w-5 mr-2 text-primary" />
          Announcements
        </h2>
        
        {isLoading ? (
          <div className="text-center py-4">
            Loading announcements...
          </div>
        ) : isError ? (
          <div className="text-center py-4 text-muted-foreground">
            Unable to load announcements.
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No announcements at this time.
          </div>
        ) : (
          <div>
            {announcements.map((announcement, index) => {
              // Get the icon component or default to BellRing
              const IconComponent = iconMap[announcement.icon as keyof typeof iconMap] || BellRing;
              const isLast = index === announcements.length - 1;
              
              return (
                <div key={announcement.id}>
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 ${
                      announcement.icon === 'trending-up' ? 'text-green-500' : 
                      announcement.icon === 'calendar' ? 'text-blue-500' : 
                      announcement.icon === 'users' ? 'text-purple-500' : 'text-amber-500'
                    } mt-0.5`} />
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{announcement.title}</h3>
                        {renderAnnouncementSource(announcement)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{announcement.content}</p>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">
                          {announcement.date && new Date(announcement.date).toLocaleDateString()}
                        </span>
                        {announcement.priority && (
                          <span className={`text-xs rounded-full px-2 py-0.5 ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            announcement.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {announcement.priority}
                          </span>
                        )}
                      </div>
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
