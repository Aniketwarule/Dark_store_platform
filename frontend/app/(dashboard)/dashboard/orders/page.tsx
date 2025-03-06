'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
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
import { toast } from 'sonner'; // Assuming you're using shadcn/ui sonner for toasts

// Configure axios base URL
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define Order interface
interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  orderDate: Date;
  totalOrderValue: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  products: Array<{
    productName: string;
    quantity: number;
    sellingPrice: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      console.log('Fetched orders:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate a new order
  const generateOrder = async () => {
    try {
      setLoading(true);
      console.log('Attempting to generate order');
      
      const response = await axios.post('/api/orders/create', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Order generation response:', response.data);
      
      toast.success('Order Generated', {
        description: `Order ${response.data.order.orderId} created successfully`
      });
      
      // Refresh the order list
      await fetchOrders();
    } catch (error) {
      console.error('Detailed error generating order:', error);
      
      // More detailed error handling
      if (axios.isAxiosError(error)) {
        toast.error('Order Generation Failed', {
          description: error.response?.data?.message || error.message
        });
      } else {
        toast.error('Unexpected Error', {
          description: 'An unexpected error occurred while generating the order'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      await axios.patch(`/api/orders/${id}/status`, { status });
      
      toast.success('Order Status Updated', {
        description: `Order status changed to ${status}`
      });
      
      await fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error('Error updating order status:', error);
      
      toast.error('Failed to Update Order Status', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesSearch = 
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const statusPriority = { 'Pending': 0, 'Processing': 1, 'Delivered': 2, 'Cancelled': 3 };
      return statusPriority[a.status] - statusPriority[b.status];
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
          <Button 
            onClick={generateOrder} 
            disabled={loading}
            variant={loading ? 'outline' : 'default'}
          >
            {loading ? 'Generating...' : 'Generate Order'}
          </Button>
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
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{format(new Date(order.orderDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{order.products.reduce((sum, product) => sum + product.quantity, 0)}</TableCell>
                  <TableCell>${order.totalOrderValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={
                        order.status === 'Pending' ? 'bg-yellow-500' :
                        order.status === 'Processing' ? 'bg-blue-500' :
                        order.status === 'Delivered' ? 'bg-green-500' : 
                        'bg-red-500'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === 'Pending' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateOrderStatus(order._id, 'Processing')}
                        disabled={loading}
                      >
                        Execute
                      </Button>
                    )}
                    {order.status === 'Processing' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateOrderStatus(order._id, 'Delivered')}
                        disabled={loading}
                      >
                        Done
                      </Button>
                    )}
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