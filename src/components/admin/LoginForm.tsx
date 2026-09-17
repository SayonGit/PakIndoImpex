"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { TextField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "loading" | "error";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Invalid email or password.");
        setStatus("error");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField label="Email" name="email" type="email" autoComplete="username" required />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" required />

      {error && (
        <p role="alert" className="rounded-xl bg-secondary-50 px-4 py-3 text-sm font-medium text-secondary-700">
          {error}
        </p>
      )}

      <Button type="submit" disabled={status === "loading"} className="w-full justify-center">
        {status === "loading" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <LogIn className="size-4" aria-hidden />
        )}
        Sign In
      </Button>
    </form>
  );
}
