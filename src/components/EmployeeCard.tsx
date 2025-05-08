
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, User } from 'lucide-react';
import { EmployeeDetails } from './EmployeeDetails';

interface EmployeeCardProps {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'on-leave' | 'remote' | 'inactive' | 'out-of-office';
  imageUrl?: string;
  image_url?: string;
  hireDate?: string;
  managerId?: string;
}

export function EmployeeCard({
  id,
  name,
  position,
  department,
  email,
  phone,
  status,
  imageUrl,
  image_url,
  hireDate,
  managerId
}: EmployeeCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  // Use either imageUrl or image_url, whichever is available
  const profileImage = imageUrl || image_url;

  // For debugging purposes - will show in console each status for troubleshooting
  console.log(`Employee ${name} status:`, status);

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Office</Badge>;
      case 'on-leave':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">On Leave</Badge>;
      case 'remote':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Remote</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactive</Badge>;
      case 'out-of-office':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Out of Office</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Unknown</Badge>;
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 card-hover">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
              {profileImage ? (
                <AvatarImage 
                  src={profileImage} 
                  alt={name}
                  className="object-cover"
                  onError={(e) => {
                    console.log(`Error loading image for ${name}`);
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";
                  }}
                />
              ) : (
                <AvatarFallback className="text-2xl">
                  <User size={32} />
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="text-center sm:text-left grow">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{position}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="outline">{department}</Badge>
                {getStatusBadge()}
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{phone}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/50 px-6 py-3 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(true)}>View Profile</Button>
          <Button variant="ghost" size="sm" onClick={() => window.location.href = `mailto:${email}`}>Contact</Button>
        </div>
      </Card>

      <EmployeeDetails 
        employee={{
          id,
          name,
          position,
          department,
          email,
          phone,
          status,
          imageUrl: profileImage,
          hireDate,
          managerId
        }}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}
