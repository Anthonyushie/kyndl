"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Menu, Tag, HelpCircle, FileText, Info, ChevronDown, Building2, Package } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { PassportButton } from "@/components/passport-button"

export function SiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false)

  const services = [
    {
      href: "/3D-architecture-visualization-studio",
      label: "ArchViz Render",
      icon: Building2,
      description: "Photoreal 3D renders & CGI walkthroughs",
    },
    {
      href: "/3d-product-rendering",
      label: "3D Product Rendering",
      icon: Package,
      description: "Studio-quality product visuals",
    },
    {
      href: "/",
      label: "3D Product Animation",
      icon: Package,
      description: "Motion-led storytelling for products",
    },
  ]

  const links = [
    { href: "#creators", label: "Creators", icon: FileText },
    { href: "#affiliates", label: "Affiliates", icon: Tag },
    { href: "#docs", label: "Docs", icon: HelpCircle },
    { href: "https://mezo.org", label: "Built on Mezo", icon: Info },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={100} height={24} className="h-6 w-auto" />
            <span className="sr-only">Kyndl</span>
          </Link>

          {/* Desktop Nav with Services Dropdown */}
          <nav className="hidden items-center gap-6 text-sm text-white/90 md:flex">

            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-purple-300 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <PassportButton />
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 bg-gray-900/80 text-gray-200 hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="liquid-glass border-gray-800 p-0 w-64 flex flex-col">
                {/* Brand Header */}
                <div className="flex items-center gap-1.5 px-4 py-4 border-b border-gray-800">
                  <Image src="/images/kyndl_logo.png" alt="Kyndl logo" width={120} height={28} className="h-7 w-auto" />
                  <span className="sr-only">Kyndl</span>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-gray-200">


                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 hover:text-purple-300 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                        <l.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm">{l.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* CTA Button at Bottom */}
                <div className="mt-auto border-t border-gray-800 p-4">
                  <PassportButton className="w-full" />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
