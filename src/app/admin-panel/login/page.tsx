import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AdminLoginForm />
    </div>
  );
}
