"use client";

import { useEffect, useState } from "react";

/**
 * Renders a timestamp in the VIEWER's own timezone + locale. Server components
 * would otherwise format dates in the server's timezone, which is wrong for a
 * worldwide audience. Pass an ISO string (date.toISOString()).
 */
export function LocalTime({
  iso,
  mode = "datetime",
}: {
  iso: string;
  mode?: "date" | "datetime";
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    const d = new Date(iso);
    setText(
      mode === "date"
        ? d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : d.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
    );
  }, [iso, mode]);

  // Empty during SSR/first paint (filled on mount) so there's no hydration mismatch.
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
