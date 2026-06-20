"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rentAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";

export function RentButton({
  robotId,
  affordable,
  allowed = true,
}: {
  robotId: string;
  affordable: boolean;
  allowed?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const blocked = !allowed || !affordable;

  async function onClick() {
    setLoading(true);
    setError("");
    const res = await rentAction(robotId);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  const label = loading
    ? "Processing..."
    : !allowed
      ? "Upgrade only"
      : !affordable
        ? "Insufficient balance"
        : "Rent this robot";

  return (
    <div>
      <Button
        type="button"
        onClick={onClick}
        disabled={blocked || loading}
        variant={blocked ? "outline" : "primary"}
        className="w-full"
      >
        {label}
      </Button>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
