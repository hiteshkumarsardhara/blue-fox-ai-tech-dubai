"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rentAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n/i18n-provider";

export function RentButton({
  robotId,
  affordable,
  allowed = true,
}: {
  robotId: string;
  affordable: boolean;
  allowed?: boolean;
}) {
  const { t } = useTranslations();
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
    ? t("portal.invest.processing")
    : !allowed
      ? t("portal.invest.upgradeOnly")
      : !affordable
        ? t("portal.invest.insufficientBalance")
        : t("portal.invest.rentThisRobot");

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
