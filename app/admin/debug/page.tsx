"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDebugPage() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authFromLS = localStorage.getItem("admin-auth");
      const authFromCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-auth="));

      setDebugInfo({
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        protocol: window.location.protocol,
        host: window.location.host,
        isProduction: window.location.protocol === "https:",
        localStorage: authFromLS ? JSON.parse(authFromLS) : null,
        cookie: authFromCookie
          ? JSON.parse(decodeURIComponent(authFromCookie.split("=")[1]))
          : null,
        userAgent: navigator.userAgent,
      });
    }
  }, []);

  const testLogin = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@bobbin.com",
          password: "admin123",
        }),
      });

      const result = await response.json();
      console.log("Test login result:", result);
      alert(`Login test: ${response.ok ? "SUCCESS" : "FAILED"}`);
    } catch (error) {
      console.error("Test login error:", error);
      alert(`Login test ERROR: ${error}`);
    }
  };

  const forceRedirect = () => {
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Debug Information</h1>

        <Card>
          <CardHeader>
            <CardTitle>Authentication State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Is Authenticated:</strong> {String(isAuthenticated)}
              </p>
              <p>
                <strong>User:</strong> {user ? JSON.stringify(user) : "null"}
              </p>
              <p>
                <strong>Token:</strong>{" "}
                {token ? `${token.substring(0, 20)}...` : "null"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <div className="space-x-4">
          <Button onClick={testLogin} variant="outline">
            Test Login API
          </Button>
          <Button onClick={forceRedirect} variant="outline">
            Force Redirect to Dashboard
          </Button>
          <Button onClick={() => router.push("/admin/dashboard")}>
            Router Push to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
