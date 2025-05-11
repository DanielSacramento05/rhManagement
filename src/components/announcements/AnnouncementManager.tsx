
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BellRing, Edit, Trash, Plus, Users, Calendar, AlertCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Announcement, createAnnouncement, deleteAnnouncement, getAnnouncements, updateAnnouncement } from "@/services/announcementService";
import { getCurrentUser } from "@/services/authService";
import { Badge } from "@/components/ui/badge";

// Map icon names to Lucide components for display
const iconMap = {
  'bell': BellRing,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'info': AlertCircle,
  'users': Users
};

export function AnnouncementManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  
  // Form data with proper typing
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
    icon: string;
    is_global: boolean; // Changed to snake_case to match Announcement interface
  }>({
    title: '',
    content: '',
    priority: 'medium',
    icon: 'bell',
    is_global: isAdmin // Changed to snake_case to match Announcement interface
  });
  
  // Query announcements that the current user manages
  const { data: announcementsData, isLoading } = useQuery({
    queryKey: ['announcements', 'manager', currentUser?.departmentId, currentUser?.role],
    queryFn: () => getAnnouncements(),
  });
  
  const announcements = announcementsData?.data || [];
  
  // Create announcement mutation
  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Announcement Created",
        description: isAdmin ? "Announcement has been published to all employees." : "Announcement has been published to your team.",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    }
  });
  
  // Update announcement mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Announcement> }) => 
      updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Announcement Updated",
        description: "The announcement has been successfully updated.",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    }
  });
  
  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    }
  });
  
  const handleAddNew = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      icon: 'bell',
      is_global: isAdmin // Changed to snake_case
    });
    setIsAddDialogOpen(true);
  };
  
  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority || 'medium',
      icon: announcement.icon || 'bell',
      is_global: announcement.is_global || false // Changed to snake_case
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };
  
  // Save new announcement
  const saveNewAnnouncement = () => {
    createMutation.mutate(formData);
  };
  
  // Save edited announcement
  const saveEditedAnnouncement = () => {
    if (selectedAnnouncement) {
      updateMutation.mutate({
        id: selectedAnnouncement.id,
        data: formData
      });
    }
  };
  
  const confirmDelete = () => {
    if (selectedAnnouncement) {
      deleteMutation.mutate(selectedAnnouncement.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // European format DD/MM/YYYY
  };
  
  // Determine if an announcement is global or team-based
  const getAnnouncementScope = (announcement: Announcement) => {
    if (announcement.is_global) {
      return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Company-wide</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200">Team</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Announcements</CardTitle>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No announcements. Click "New Announcement" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => {
              // Get icon component
              const IconComponent = iconMap[announcement.icon as keyof typeof iconMap] || BellRing;
              
              return (
                <div key={announcement.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{announcement.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(announcement.date)}
                          </span>
                          {getAnnouncementScope(announcement)}
                          {announcement.priority && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              announcement.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                                : announcement.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            }`}>
                              {announcement.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {announcement.content}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(announcement)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Announcement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Announcement title"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Announcement details"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value as 'low' | 'medium' | 'high'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select 
                value={formData.icon}
                onValueChange={(value) => setFormData({...formData, icon: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bell">Bell</SelectItem>
                  <SelectItem value="trending-up">Trending Up</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="visibility">Visibility:</Label>
                <Select
                  value={formData.is_global ? "global" : "team"}
                  onValueChange={(value) => setFormData({...formData, is_global: value === "global"})}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Company-wide</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNewAnnouncement}>
              Add Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-priority">Priority</Label>
              <Select 
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value as 'low' | 'medium' | 'high'})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-icon">Icon</Label>
              <Select 
                value={formData.icon}
                onValueChange={(value) => setFormData({...formData, icon: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bell">Bell</SelectItem>
                  <SelectItem value="trending-up">Trending Up</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="visibility">Visibility:</Label>
                <Select
                  value={formData.is_global ? "global" : "team"}
                  onValueChange={(value) => setFormData({...formData, is_global: value === "global"})}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Company-wide</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedAnnouncement}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the announcement "{selectedAnnouncement?.title}"? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AnnouncementManager;
