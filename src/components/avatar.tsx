/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={`Avatar ${name}`}
        className={cn("rounded-full border border-border-subtle object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-full border-2 border-border-subtle bg-[radial-gradient(circle_at_30%_25%,#22c55e33,#111214_60%)] font-[800] text-accent-green",
        className
      )}
    >
      {name.charAt(0)}
    </span>
  );
}
