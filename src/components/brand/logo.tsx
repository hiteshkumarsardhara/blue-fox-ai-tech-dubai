import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/** Blue Fox logo — the official brand asset (transparent PNG, blue + orange). */
export function Logo({
  className,
  height = 38,
  priority = false,
}: {
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  // Logo intrinsic ratio is ~2.116:1 (8768 x 4144).
  const width = Math.round(height * 2.116);

  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/brand/blue-fox-logo.png"
        alt={site.name}
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className="w-auto"
        style={{ height }}
      />
    </Link>
  );
}
