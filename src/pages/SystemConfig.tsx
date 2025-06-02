
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Database, Shield, Bell, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const SystemConfig = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    sessionTimeout: 30,
    maxFileSize: 10,
    enableRegistration: true
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "System configuration has been updated successfully.",
    });
  };

  const handleTestEmail = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to the admin email address.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">System Configuration</h1>
          <p className="text-muted-foreground">Manage system-wide settings and configurations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic system configuration options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable access to the system
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, maintenanceMode: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Enable new users to register accounts
                </p>
              </div>
              <Switch
                checked={settings.enableRegistration}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, enableRegistration: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, maxFileSize: Number(e.target.value) }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Email & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email & Notifications
            </CardTitle>
            <CardDescription>
              Configure email and notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for important events
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>

            <Button variant="outline" onClick={handleTestEmail} className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send Test Email
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Security and access control settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password Policy</Label>
              <p className="text-sm text-muted-foreground">
                Minimum 8 characters, include uppercase, lowercase, number, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Currently disabled - Feature coming soon
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Database & Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database & Backup
            </CardTitle>
            <CardDescription>
              Database maintenance and backup settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Daily automated database backups
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, autoBackup: checked }))
                }
              />
            </div>

            <Button variant="outline" className="w-full">
              <Database className="mr-2 h-4 w-4" />
              Create Manual Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default SystemConfig;
