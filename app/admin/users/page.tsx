"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users as UsersIcon } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Users
        </h1>
        <p className="text-gray-600 mt-2">Manage admin users and permissions</p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5" />
            <span>User Management</span>
          </CardTitle>
          <CardDescription>
            Admin user management and role-based access control
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <UsersIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              User Management Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We&apos;re developing a comprehensive user management system with
              role-based access control, user invitations, and permission
              management.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
