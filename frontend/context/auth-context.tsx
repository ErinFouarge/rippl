"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode, useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import type { LoginPayload, RegisterPayload, User } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (data: LoginPayload) => Promise<void>;
  signUp: (data: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = useCallback(
    async (data: LoginPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authService.login(data);
        setUser({ id: "", username: res.username, email: data.email });
        router.push("/home");
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail ?? "Identifiants incorrects.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const signUp = useCallback(
    async (data: RegisterPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authService.register(data);
        setUser({ id: res.id, username: res.username, email: res.email });
        router.push("/home");
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail ?? "Une erreur est survenue.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    router.push("/login");
  }, [queryClient, router]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, signIn, signUp, signOut, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
