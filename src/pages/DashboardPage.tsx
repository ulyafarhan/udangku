import { useMediaQuery } from "@/hooks/use-media-query";
import { DashboardDesktop } from "@/components/Dashboard/DashboardDesktop";
import { DashboardMobile } from "@/components/Dashboard/DashboardMobile";

export function DashboardPage() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? <DashboardDesktop /> : <DashboardMobile />;
}