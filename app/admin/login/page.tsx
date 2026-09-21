import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { loginAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="container flex min-h-[70vh] max-w-sm flex-col justify-center py-14">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ShieldCheck className="h-6 w-6" />
      </span>
      <h1 className="mt-4 font-display text-2xl font-semibold">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the admin password to manage listings. This is an interim safeguard until real
        accounts are wired up.
      </p>

      <form action={loginAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next ?? "/admin"} />
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoFocus />
        </div>
        {error && <p className="text-sm text-red-600">Incorrect password. Try again.</p>}
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </div>
  );
}
