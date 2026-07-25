"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { confirmPasswordReset } from "@/lib/api/auth";
import { setStoredAccessToken } from "@/lib/auth-storage";
import { getApiErrorMessage } from "@/lib/api/client";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

function decodeJwtSubject(jwt: string): string {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1].replaceAll("-", "+").replaceAll("_", "/")));
    return (payload.sub as string) ?? "";
  } catch {
    return "";
  }
}

function InvalidLinkCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invalid link</CardTitle>
        <CardDescription>This password reset link is missing or invalid.</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Request a new reset link
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: confirmPasswordReset,
    onSuccess: (data) => {
      const username = decodeJwtSubject(data.accessToken);
      setStoredAccessToken(data.accessToken);
      window.localStorage.setItem("sllp.user", JSON.stringify({ username, role: data.role }));
      window.location.href = "/dashboard";
    },
  });

  if (!token) return <InvalidLinkCard />;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);
    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    mutation.mutate({ token, newPassword });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {(mutation.isError || validationError) && (
            <ErrorState message={validationError ?? getApiErrorMessage(mutation.error)} />
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Set new password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
