"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword, createAdminSession } from "@/lib/admin/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextParam = String(formData.get("next") ?? "/admin");
  const next = nextParam.startsWith("/admin") ? nextParam : "/admin";

  const ok = await verifyAdminPassword(password);
  if (!ok) {
    redirect(`/admin/login?next=${encodeURIComponent(next)}&error=1`);
  }

  await createAdminSession();
  redirect(next);
}
