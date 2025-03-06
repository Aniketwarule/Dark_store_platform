'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Clock, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

const BASEURL = "https://dark-store-platform.onrender.com"

const data = [
  { name: 'Mon', orders: 1 },
  { name: 'Tue', orders: 2 },
  { name: 'Wed', orders: 2 },
  { name: 'Thu', orders: 2 },
  { name: 'Fri', orders: 1 },
  { name: 'Sat', orders: 3 },
  { name: 'Sun', orders: 4 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeStaff: 3, // Example static value
    products: 9,    // Example static value
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`${BASEURL}/api/orders/stats`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched stats:', data);
        setStats((prevStats) => ({
          ...prevStats,
          totalOrders: data.totalOrders,
          totalRevenue: data.totalRevenue,
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  const statsData = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      trend: '+12.5%', // Example static trend
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff,
      icon: Users,
      trend: '+2.1%', // Example static trend
    },
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      trend: '+5.4%', // Example static trend
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue}`,
      icon: TrendingUp,
      trend: '+8.2%', // Example static trend
    },
  ];

  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                <h3 className="text-2xl font-bold text-green-500">2 hours</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">{stat.trend}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Orders</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
