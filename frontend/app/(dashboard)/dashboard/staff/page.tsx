'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
const BASEURL = "http://localhost:8000";

const roles = ['All Roles', 'Store Manager', 'Inventory Specialist', 'Order Fulfillment', 'Delivery Coordinator'];

export default function StaffPage() {
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [staff, setStaff] = useState([]);

  // Fetch staff data on component mount
  useEffect(() => {
    console.log('Fetching staff data...');
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setStaff([]);
      const response = await axios.get(`${BASEURL}/inventory/staff`);
      // console.log(response.data);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch staff data');
      // }
      
      const data = await response.data;
      const staffArray: any = Object.values(data);
      console.log(staffArray);
      setStaff(staffArray);
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  // const filteredStaff = staff.filter((member) => {
  //   const matchesRole = selectedRole === 'All Roles' || member.role === selectedRole;
  //   const matchesSearch = 
  //     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     member.email.toLowerCase().includes(searchQuery.toLowerCase());
  //   return matchesRole && matchesSearch;
  // });

  return (
    <>
      <Header title="Staff Management" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search staff..."
              className="w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button>Add Staff Member</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member: any) => (
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                {/* <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar> */}
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  {/* <CardDescription>{member.email}</CardDescription> */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">Section Id: {member.section}</span>
                  {/* <Badge
                    variant={member.status === 'Active' ? 'default' : 'secondary'}
                  >
                    {member.status}
                  </Badge> */}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    {/* <span className="text-muted-foreground">Performance</span> */}
                    <span className="font-medium">{member.task}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      // style={{ width: `${member.task}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="ghost" size="sm">View Profile</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}