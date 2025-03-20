
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

interface EmployeeCardProps {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'on-leave' | 'remote';
  imageUrl: string;
  onClick?: () => void;
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
  onClick
}: EmployeeCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Office</Badge>;
      case 'on-leave':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">On Leave</Badge>;
      case 'remote':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Remote</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 card-hover" onClick={onClick}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
            <img src={imageUrl} alt={name} className="object-cover" />
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
        <Button variant="ghost" size="sm">View Profile</Button>
        <Button variant="ghost" size="sm">Contact</Button>
      </div>
    </Card>
  );
}
