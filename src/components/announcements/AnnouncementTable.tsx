
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, TrendingUp, Calendar, AlertCircle, Users } from "lucide-react";
import { getAnnouncements } from "@/services/announcementService";
import { getCurrentUser } from "@/services/authService";
import { format } from "date-fns";

// Map icon names to Lucide components
const iconMap = {
  'bell': BellRing,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'info': AlertCircle,
  'users': Users
};

export function AnnouncementTable() {
  const currentUser = getCurrentUser();
  
  // Fetch announcements for the current user
  const { data: announcementsData, isLoading, isError } = useQuery({
    queryKey: ['announcements', currentUser?.departmentId, currentUser?.role],
    queryFn: () => getAnnouncements(),
  });

  const announcements = announcementsData?.data || [];

  // Render the appropriate badge for priority
  const renderPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return (
          <Badge variant="destructive">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="secondary">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  // Render the appropriate badge for scope (global vs. department)
  const renderScopeBadge = (isGlobal: boolean) => {
    return isGlobal ? (
      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
        Company-wide
      </Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
        Team
      </Badge>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Render the icon component
  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || BellRing;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading announcements...</div>
        ) : isError ? (
          <div className="text-center py-4 text-muted-foreground">
            Unable to load announcements
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No announcements available at this time
          </div>
        ) : (
          <Table>
            <TableCaption>
              List of all announcements visible to you
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[100px]">Visibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {renderIcon(announcement.icon || 'bell')}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {announcement.content}
                  </TableCell>
                  <TableCell>{formatDate(announcement.date)}</TableCell>
                  <TableCell>{renderPriorityBadge(announcement.priority || 'medium')}</TableCell>
                  <TableCell>{renderScopeBadge(announcement.is_global || false)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default AnnouncementTable;
