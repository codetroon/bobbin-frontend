"use client";

import { StatsCard } from "@/components/admin/stats-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        apiClient.getProducts({ limit: 1000 }),
        apiClient.getOrders({ limit: 1000 }),
      ]);

      const products = productsResponse.data?.data || [];
      const orders = ordersResponse.data?.data || [];

      const totalRevenue = orders.reduce(
        (sum: number, order: any) => sum + order.totalPrice,
        0
      );
      const pendingOrders = orders.filter(
        (order: any) => order.status === "pending"
      ).length;
      const recentOrders = orders.slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        lowStockProducts: 0, // This would require stock data from sizes
        recentOrders,
      });
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of your store&apos;s performance
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>View Analytics</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend="+12.5%"
          trendUp={true}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend="+8.2%"
          trendUp={true}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+15.3%"
          trendUp={true}
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Users}
          trend="-2.1%"
          trendUp={false}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-600">
                      Order #{order.id.slice(-8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.totalPrice}</p>
                    <p
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Package className="h-6 w-6 mb-2" />
                <span>Add Product</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <ShoppingCart className="h-6 w-6 mb-2" />
                <span>View Orders</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Users className="h-6 w-6 mb-2" />
                <span>Manage Users</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
