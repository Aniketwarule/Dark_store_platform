'use client';

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
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

const data = [
  { name: 'Mon', orders: 4000 },
  { name: 'Tue', orders: 3000 },
  { name: 'Wed', orders: 2000 },
  { name: 'Thu', orders: 2780 },
  { name: 'Fri', orders: 1890 },
  { name: 'Sat', orders: 2390 },
  { name: 'Sun', orders: 3490 },
];

const stats = [
  {
    title: 'Total Orders',
    value: '2,345',
    icon: ShoppingCart,
    trend: '+12.5%',
  },
  {
    title: 'Active Staff',
    value: '15',
    icon: Users,
    trend: '+2.1%',
  },
  {
    title: 'Products',
    value: '1,234',
    icon: Package,
    trend: '+5.4%',
  },
  {
    title: 'Revenue',
    value: '$12,345',
    icon: TrendingUp,
    trend: '+8.2%',
  },
];

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
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