"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAccount, useDisconnect } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import {
  Bell,
  CircleDollarSign,
  Home,
  Library,
  LifeBuoy,
  LogOut,
  Menu,
  Package2,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Settings,
  ShoppingBag,
  UserRound,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const guestSections = [
  {
    title: "Navigation",
    items: [
      { label: "Home", href: "/app", icon: Home, match: "/app" },
      { label: "Campaigns", href: "/app/campaigns", icon: Package2, match: "/app/campaigns" },
      { label: "Receipts", href: "/app/campaigns#checkout-pages", icon: CircleDollarSign, match: "/app/campaigns" },
    ],
  },
]

const connectedSections = [
  {
    title: "Navigation",
    items: [
      { label: "Home", href: "/app", icon: Home, match: "/app" },
      { label: "Campaigns", href: "/app/campaigns", icon: Package2, match: "/app/campaigns" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Create Campaign", href: "/app/create-campaign", icon: PlusCircle, match: "/app/create-campaign" },
      { label: "My Library", href: "/app/campaigns", icon: Library, match: "/app/campaigns" },
      { label: "Affiliates", href: "/app/campaigns#affiliate-program", icon: Users, match: "/app/campaigns" },
      { label: "Checkout Pages", href: "/app/campaigns#checkout-pages", icon: ShoppingBag, match: "/app/campaigns" },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Notifications", href: "/app", icon: Bell, match: "/app" }],
  },
]

const utilityItems = [
  { label: "Help Center", href: "/#docs", icon: LifeBuoy, match: "/" },
  { label: "Settings", href: "/t&c", icon: Settings, match: "/t&c" },
]

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function isItemActive(pathname: string, match: string) {
  if (match === "/") {
    return pathname === "/"
  }

  if (match === "/app") {
    return pathname === "/app"
  }

  return pathname === match || pathname.startsWith(`${match}/`)
}

export function AppDashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const hasWalletSession = isHydrated && isConnected
  const ctaLabel = useMemo(() => {
    return hasWalletSession && address ? truncateAddress(address) : "Connect Wallet"
  }, [address, hasWalletSession])
  const sidebarSections = hasWalletSession ? connectedSections : guestSections
  const walletInitials = useMemo(() => {
    if (!address) return "KY"
    return address.slice(2, 4).toUpperCase()
  }, [address])

  return (
    <main className="min-h-screen overflow-hidden bg-[#07030d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,54,77,0.24),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(145,102,255,0.16),transparent_30%),linear-gradient(135deg,#07030d_0%,#100414_45%,#050308_100%)]" />

      <div className="relative flex min-h-screen">
        <aside
          className={`hidden shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-[#030303]/95 transition-[width] duration-300 lg:flex ${
            sidebarCollapsed ? "w-[88px]" : "w-[248px]"
          }`}
        >
          <div className={`relative ${sidebarCollapsed ? "px-4 py-6" : "px-6 py-7"}`}>
            {sidebarCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                  <span className="sr-only">Expand sidebar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <Link href="/" className="flex items-center gap-3">
                  <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={100} height={24} className="h-7 w-auto" />
                  <span className="sr-only">Kyndl</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <PanelLeftClose className="h-4 w-4" />
                  <span className="sr-only">Collapse sidebar</span>
                </button>
              </div>
            )}
          </div>

          <div className={`space-y-10 ${sidebarCollapsed ? "px-3" : "px-6"}`}>
            {sidebarSections.map((section) => (
              <div key={section.title}>
                {!sidebarCollapsed ? (
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">{section.title}</div>
                ) : null}
                <nav className={`mt-4 ${sidebarCollapsed ? "space-y-3" : "space-y-2"}`}>
                  {section.items.map((item) => {
                    const active = isItemActive(pathname, item.match)

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center rounded-full py-3 text-sm transition-colors ${
                          active
                            ? "bg-[rgba(255,54,77,0.16)] text-white"
                            : "text-white/75 hover:bg-white/6 hover:text-white"
                        } ${sidebarCollapsed ? "justify-center px-0" : "gap-3 px-4"}`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!sidebarCollapsed ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className={`mt-auto pb-8 ${sidebarCollapsed ? "px-3" : "px-4"}`}>
            {hasWalletSession ? (
              <>
                {!sidebarCollapsed ? (
                  <div className="group overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(145deg,rgba(149,95,255,0.95),rgba(255,89,116,0.92))]">
                    <div className="relative p-4">
                      <div className="absolute right-0 top-0 h-14 w-14 translate-x-3 -translate-y-3 rounded-full bg-[#ffba59] opacity-0 transition duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-100" />
                      <div className="relative">
                        <div className="font-display text-[1.55rem] font-bold leading-tight tracking-tight text-white">
                          Launch a campaign
                        </div>
                        <div className="mt-1 text-base font-semibold text-white/90">Route referrals in minutes</div>
                        <Button asChild className="mt-4 h-10 w-full rounded-full bg-white text-sm text-[#8f56ff] hover:bg-white/90">
                          <Link href="/app/create-campaign">Open builder</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className={`mt-6 ${sidebarCollapsed ? "" : "rounded-[22px] border border-white/10 bg-white/[0.03] px-3 py-3"}`}>
                  {sidebarCollapsed ? (
                    <button
                      type="button"
                      onClick={() => setSidebarCollapsed(false)}
                      className="flex w-full items-center justify-center py-2 text-white/75 transition hover:text-white"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7f55ff,#ff4d7a)] font-mono text-xs font-semibold text-white">
                        {walletInitials}
                      </div>
                      <span className="sr-only">Open sidebar profile</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7f55ff,#ff4d7a)] font-mono text-xs font-semibold text-white">
                        {walletInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-white">Wallet connected</div>
                        <div className="truncate font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                          {ctaLabel}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => disconnect()}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Disconnect wallet</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              !sidebarCollapsed ? (
                <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
                  <div className="relative p-5">
                    <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full border-[14px] border-[#ff364d] opacity-85" />
                    <div className="relative">
                      <div className="font-display text-3xl font-bold tracking-tight text-white">Connect</div>
                      <div className="text-xl font-semibold text-white/90">your wallet</div>
                      <p className="mt-2 max-w-[14rem] text-sm leading-6 text-white/65">
                        Enter the Kyndl app surface, then publish campaigns and inspect settlement states.
                      </p>
                      <Button
                        variant="accent"
                        className="mt-5 w-full justify-center"
                        onClick={() => openConnectModal?.()}
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null
            )}

            <div className={`mt-6 space-y-2 ${sidebarCollapsed ? "px-0" : "px-2"}`}>
              {utilityItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center rounded-full text-sm text-white/70 transition hover:bg-white/6 hover:text-white ${
                    sidebarCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
                </Link>
              ))}
            </div>

            {sidebarCollapsed && !hasWalletSession ? (
              <button
                type="button"
                onClick={() => openConnectModal?.()}
                className="mt-5 flex w-full items-center justify-center py-2 text-white/75 transition hover:text-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <UserRound className="h-5 w-5" />
                </div>
                <span className="sr-only">Connect wallet</span>
              </button>
            ) : null}
          </div>
        </aside>

        <section className="relative flex-1">
          <header className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open app navigation</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px] border-white/10 bg-[#030303] p-0 text-white">
                  <div className="border-b border-white/10 px-5 py-6">
                    <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={100} height={24} className="h-7 w-auto" />
                  </div>
                  <div className="space-y-8 px-5 py-6">
                    {sidebarSections.map((section) => (
                      <div key={section.title}>
                        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">{section.title}</div>
                        <div className="mt-4 space-y-2">
                          {section.items.map((item) => {
                            const active = isItemActive(pathname, item.match)

                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm ${
                                  active ? "bg-[rgba(255,54,77,0.16)] text-white" : "text-white/75"
                                }`}
                              >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))}

                    {hasWalletSession ? (
                      <div className="space-y-4">
                        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(149,95,255,0.95),rgba(255,89,116,0.92))]">
                          <div className="relative p-5">
                            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#ffba59]" />
                            <div className="relative">
                              <div className="font-display text-[2rem] font-bold leading-tight tracking-tight text-white">
                                Launch a campaign
                              </div>
                              <div className="mt-1 text-lg font-semibold text-white/90">Start routing today</div>
                              <Button asChild className="mt-5 h-11 w-full rounded-full bg-white text-[#8f56ff] hover:bg-white/90">
                                <Link href="/app/create-campaign">Open builder</Link>
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7f55ff,#ff4d7a)] font-mono text-xs font-semibold text-white">
                              {walletInitials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold text-white">Wallet connected</div>
                              <div className="truncate font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                                {ctaLabel}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => disconnect()}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                            >
                              <LogOut className="h-4 w-4" />
                              <span className="sr-only">Disconnect wallet</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      {utilityItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 rounded-full px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/6 hover:text-white"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={100} height={24} className="h-7 w-auto" />
            </div>

            <div className="hidden lg:block" />

            <Button
              variant="accent"
              className="min-w-[132px] justify-center"
              onClick={() => {
                if (!hasWalletSession) openConnectModal?.()
              }}
            >
              {ctaLabel}
            </Button>
          </header>

          <div className="px-4 pb-10 sm:px-6 lg:px-10 lg:pb-16">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
