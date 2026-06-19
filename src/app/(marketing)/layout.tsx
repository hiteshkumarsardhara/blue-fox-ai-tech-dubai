import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { TradingViewTicker } from "@/components/marketing/tradingview-ticker";

/** Layout for all public marketing pages (header + ticker + footer chrome). */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <TradingViewTicker />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
