'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const orders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    date: new Date(2024, 2, 15),
    total: 125.99,
    status: 'Processing',
    items: 5,
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    date: new Date(2024, 2, 15),
    total: 89.99,
    status: 'Delivered',
    items: 3,
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    date: new Date(2024, 2, 14),
    total: 199.99,
    status: 'Pending',
    items: 7,
  },
  {
    id: 'ORD-004',
    customer: 'Alice Brown',
    date: new Date(2024, 2, 14),
    total: 45.99,
    status: 'Delivered',
    items: 2,
  },
  {
    id: 'ORD-005',
    customer: 'Charlie Wilson',
    date: new Date(2024, 2, 13),
    total: 299.99,
    status: 'Processing',
    items: 10,
  },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500',
  Processing: 'bg-blue-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <Header title="Order Management" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search orders..."
              className="w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>Export Orders</Button>
          <Button>Export Orders</Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{format(order.date, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}