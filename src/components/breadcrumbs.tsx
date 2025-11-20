"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  visiting_page?: string;
  overrideLastSegment?: string;
}

export function Breadcrumbs({
  overrideLastSegment,
  visiting_page,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Parse the pathname into breadcrumb segments
  const segments = pathname
    .split("/")
    .filter((segment) => segment !== "" && segment !== "app");

  // Create breadcrumb items with labels
  let breadcrumbs = [
    { label: "Home", href: "/" },
    ...segments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + segments.slice(0, index + 1).join("/"),
    })),
  ];

  // Override the last segment label if provided
  if (overrideLastSegment && breadcrumbs.length > 0) {
    breadcrumbs[breadcrumbs.length - 1].label = overrideLastSegment;
  }

  return (
    <nav className="flex items-center gap-2" aria-label="Breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}

          {index === breadcrumbs.length - 1 ? (
            // Current page - highlighted with primary color
            <span className="text-primary font-semibold">
              {visiting_page ?? breadcrumb.label}
            </span>
          ) : (
            // Navigation links
            <Link
              href={breadcrumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
