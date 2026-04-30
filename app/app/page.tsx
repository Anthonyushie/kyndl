"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import {
  ArrowRight,
  Bell,
  CircleDollarSign,
  Home,
  LifeBuoy,
  Library,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Menu,
  Package2,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
  Users,
  Wallet2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useDisconnect } from "wagmi"

const guestSections = [
  {
    title: "Navigation",
    items: [
      { label: "Home", href: "/app", icon: Home, match: "/app" },
      { label: "Products", href: "/dashboard", icon: Package2, match: "/dashboard" },
      { label: "Receipts", href: "/#settlement", icon: CircleDollarSign, match: "/" },
    ],
  },
]

const connectedSections = [
  {
    title: "Navigation",
    items: [
      { label: "Home", href: "/app", icon: Home, match: "/app" },
      { label: "Campaigns", href: "/dashboard", icon: Package2, match: "/dashboard" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Create Campaign", href: "/dashboard", icon: PlusCircle, match: "/dashboard" },
      { label: "My Library", href: "/dashboard", icon: Library, match: "/dashboard" },
      { label: "Affiliates", href: "/#affiliates", icon: Users, match: "/" },
      { label: "Checkout Pages", href: "/#settlement", icon: ShoppingBag, match: "/" },
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

  return pathname === match || pathname.startsWith(`${match}/`)
}

export default function AppEntryPage() {
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
          <div className={`relative px-4 py-6 ${sidebarCollapsed ? "" : "px-6 py-7"}`}>
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
                          Become a seller
                        </div>
                        <div className="mt-1 text-base font-semibold text-white/90">Start earning today</div>
                        <Button asChild className="mt-4 h-10 w-full rounded-full bg-white text-sm text-[#8f56ff] hover:bg-white/90">
                          <Link href="/dashboard">Get started</Link>
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
                        Enter the Kyndl app surface, then publish products and inspect settlement states.
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
                  <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
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
                                Become a seller
                              </div>
                              <div className="mt-1 text-lg font-semibold text-white/90">Start earning today</div>
                              <Button asChild className="mt-5 h-11 w-full rounded-full bg-white text-[#8f56ff] hover:bg-white/90">
                                <Link href="/dashboard">Get started</Link>
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
              onClick={() => openConnectModal?.()}
            >
              {ctaLabel}
            </Button>
          </header>

          <div className="px-4 pb-10 sm:px-6 lg:px-10 lg:pb-16">
            <div className="relative min-h-[720px] overflow-hidden rounded-[36px] border border-white/6 bg-[linear-gradient(180deg,rgba(8,4,15,0.92),rgba(7,4,11,0.98))] px-6 py-10 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:px-8 lg:px-12 lg:py-14">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(165,118,255,0.12),transparent_28%)]" />
              <div className="pointer-events-none absolute left-[12%] top-[18%] text-[72px] font-bold tracking-tight text-white/6 blur-[3px] sm:text-[112px] lg:text-[148px]">
                Every wallet
              </div>
              <div className="pointer-events-none absolute left-[12%] top-[38%] text-[72px] font-bold tracking-tight text-[#a576ff]/12 blur-[3px] sm:text-[112px] lg:text-[148px]">
                becomes sales
              </div>
              <div className="pointer-events-none absolute left-[12%] top-[56%] text-[72px] font-bold tracking-tight text-white/6 blur-[3px] sm:text-[112px] lg:text-[148px]">
                infrastructure.
              </div>

              <div className="relative z-10 flex max-w-3xl flex-col gap-6 pt-10 lg:pt-16">
                <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/45">Kyndl app</div>
                <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
                  Route demand.
                  <span className="block text-[#ff364d] drop-shadow-[0_0_20px_rgba(255,54,77,0.35)]" style={{ fontFamily: "'Shadows Into Light Two', cursive" }}>
                    Settle instantly.
                  </span>
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                  Kyndl turns hosted product links into live distribution rails. Connect your wallet, launch a product,
                  and let every sale resolve the split in one visible state.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="accent" className="px-6 py-6 text-base">
                    <Link href="/dashboard">Create a Product</Link>
                  </Button>
                  <Button asChild variant="ghost" className="px-6 py-6 text-base">
                    <Link href="/#settlement">
                      See how loop works
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-4 pt-4 sm:grid-cols-3">
                  <AppMetric title="Hosted products" value="Wallet-native" />
                  <AppMetric title="Referral logic" value="Permissionless" />
                  <AppMetric title="Settlement" value="Instant state" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function AppMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{title}</div>
      <div className="mt-3 text-lg font-semibold text-white">{value}</div>
    </div>
  )
}
