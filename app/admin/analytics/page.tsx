"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, DollarSign, Package, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Detailed insights into your store&apos;s performance
        </p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Analytics Dashboard</span>
          </CardTitle>
          <CardDescription>
            Comprehensive analytics and reporting features
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analytics Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We&apos;re working on comprehensive analytics features including
              sales reports, customer insights, and performance metrics. Stay
              tuned!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <DollarSign className="h-4 w-4" />
              <span>Revenue Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Daily, weekly, monthly revenue</li>
              <li>• Revenue by product category</li>
              <li>• Profit margin analysis</li>
              <li>• Revenue forecasting</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Users className="h-4 w-4" />
              <span>Customer Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Customer acquisition trends</li>
              <li>• Repeat purchase analysis</li>
              <li>• Customer lifetime value</li>
              <li>• Geographic distribution</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Package className="h-4 w-4" />
              <span>Product Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Best selling products</li>
              <li>• Inventory turnover rates</li>
              <li>• Product profitability</li>
              <li>• Stock level optimization</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
