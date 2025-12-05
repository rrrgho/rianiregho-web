import AdminAppSidebar from "@/components/admin-app-sidebar";
import ProtectAdminRoutes from "./protect-admin-routes";

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectAdminRoutes>
      <AdminAppSidebar>
        <div className="px-10">{children}</div>
      </AdminAppSidebar>
    </ProtectAdminRoutes>
  );
}
