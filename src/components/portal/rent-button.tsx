"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rentAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";

export function RentButton({
  robotId,
  affordable,
}: {
  robotId: string;
  affordable: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div>
      <Button
        type="button"
        onClick={onClick}
        disabled={!affordable || loading}
        variant={affordable ? "primary" : "outline"}
        className="w-full"
      >
        {loading ? "Processing..." : affordable ? "Rent this robot" : "Insufficient balance"}
      </Button>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
