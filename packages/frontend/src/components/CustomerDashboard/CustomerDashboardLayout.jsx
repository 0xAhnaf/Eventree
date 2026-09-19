import Footer from "../Footer";
import Navbar from "../Navbar";
import CustomerDashboardSidebar from "./CustomerDashboardSidebar";
import "./CustomerDashboardLayout.css";

export default function CustomerDashboardLayout({
  children,
  className = "",
  contentClassName = "",
  sidebarTitle,
  sidebarSubtitle,
  sidebarLinks,
}) {
  const pageClassName = ["customer-dashboard-page", className]
    .filter(Boolean)
    .join(" ");
  const mainClassName = ["customer-dashboard-main", contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={pageClassName}>
      <Navbar />

      <div className="customer-dashboard-shell">
        <CustomerDashboardSidebar
          title={sidebarTitle}
          subtitle={sidebarSubtitle}
          links={sidebarLinks}
        />

        <main className={mainClassName}>{children}</main>
      </div>

      <Footer />
    </div>
  );
}
