"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            return { success: false, error: data.message || "Login failed" };
          }

          const { user, accessToken } = data.data;

          // Only allow admin roles
          if (!["super_admin", "admin"].includes(user.role)) {
            return { success: false, error: "Insufficient permissions" };
          }

          const authState = {
            user,
            token: accessToken,
            isAuthenticated: true,
          };

          set(authState);

          // Set cookie for middleware
          if (typeof window !== "undefined") {
            document.cookie = `admin-auth=${JSON.stringify({ state: authState })}; path=/; max-age=86400; SameSite=Lax`;
          }

          return { success: true };
        } catch (error) {
          return { success: false, error: "Network error. Please try again." };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Clear cookie
        if (typeof window !== "undefined") {
          document.cookie =
            "admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      },

      setUser: (user: User, token: string) => {
        const authState = {
          user,
          token,
          isAuthenticated: true,
        };

        set(authState);

        // Set cookie for middleware
        if (typeof window !== "undefined") {
          document.cookie = `admin-auth=${JSON.stringify({ state: authState })}; path=/; max-age=86400; SameSite=Lax`;
        }
      },
    }),
    {
      name: "admin-auth",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
