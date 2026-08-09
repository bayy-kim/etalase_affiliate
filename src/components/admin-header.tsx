import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  backHref,
  actions,
}: {
  title: string;
  backHref?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="fixed top-0 left-1/2 z-50 flex h-16 w-full max-w-[480px] -translate-x-1/2 items-center justify-between border-b border-border-subtle bg-background-base/90 px-4 backdrop-blur-md">
      <div className="flex min-w-0 items-center">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Kembali"
            className="-ml-2 mr-2 flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-primary-container"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
        )}
        <h1 className="truncate text-[20px] font-[600] leading-7 tracking-[-0.01em] text-text-primary">
          {title}
        </h1>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
