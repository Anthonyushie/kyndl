import type { ReactNode } from "react"

import { AppDashboardShell } from "./_components/app-dashboard-shell"

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppDashboardShell>{children}</AppDashboardShell>
}
