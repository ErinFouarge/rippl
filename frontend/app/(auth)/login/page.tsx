"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/auth-context";
import {LoginFormValues, loginSchema} from "@/lib/schemas/auth.schema";

export default function LoginPage() {
  const { signIn, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (error) {
      toast.error(error, {
        onAutoClose: () => clearError(),
      });
    }
  }, [error, clearError]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data);
    } catch {
      toast.error("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="card p-8 shadow-sm">
      <header className="mb-7">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">
          Content de vous revoir !
        </h1>
        <p className="text-sm text-stone-500">
          Votre fil d{"'"}actualité personnalisé vous attend.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Adresse e-mail"
          type="email"
          placeholder="toi@exemple.com"
          {...register("email")}
          error={errors.email?.message}
          autoComplete="email"
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="rippl-btn-primary mt-1"
          disabled={isLoading}
        >
          {isLoading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <footer className="mt-5 text-center text-sm text-stone-500">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-medium text-rippl-600 hover:underline">
          Créer un compte
        </Link>
      </footer>
    </div>
  );
}