"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/auth-context";
import {RegisterFormValues, registerSchema} from "@/lib/schemas/auth.schema";

export default function RegisterPage() {
  const { signUp, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    if (error) {
      toast.error(error, {
        onAutoClose: () => clearError(),
      });
    }
  }, [error, clearError]);

  const onSubmit = async (data: RegisterFormValues) => {
    clearError();
    await signUp(data);
  };

  return (
    <div className="card p-8 shadow-sm">
      <header className="mb-7">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">
          Rejoins l{"'"}aventure
        </h1>
        <p className="text-sm text-stone-500">
          Juste quelques secondes pour créer ton compte et nous rejoindre.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nom d'utilisateur"
          placeholder="ton_pseudo"
          {...register("username")}
          error={errors.username?.message}
          autoComplete="username"
        />

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
          placeholder="8 caractères minimum"
          {...register("password")}
          error={errors.password?.message}
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="rippl-btn-primary mt-1"
          disabled={isLoading}
        >
          {isLoading ? "Création du compte..." : "S'inscrire"}
        </button>
      </form>

      <footer className="mt-5 text-center text-sm text-stone-500">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-medium text-rippl-600 hover:underline">
          Se connecter
        </Link>
      </footer>
    </div>
  );
}