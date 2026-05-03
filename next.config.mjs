import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pnpmLitPrefix = "../node_modules/.pnpm"
const accountsStub = "@/lib/accounts-stub.mjs"
const reownIconStub = "@/lib/reown-phosphor-stub.mjs"

const resolveAliases = {
  accounts: accountsStub,
  [`${pnpmLitPrefix}/@lit_reactive-element@2.0.4/node_modules/@lit/reactive-element/reactive-element.mjs`]:
    "@lit/reactive-element/reactive-element.js",
  [`${pnpmLitPrefix}/@lit_reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/custom-element.mjs`]:
    "@lit/reactive-element/decorators/custom-element.js",
  [`${pnpmLitPrefix}/@lit_reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/property.mjs`]:
    "@lit/reactive-element/decorators/property.js",
  [`${pnpmLitPrefix}/@lit_reactive-element@2.0.4/node_modules/@lit/reactive-element/css-tag.mjs`]:
    "@lit/reactive-element/css-tag.js",
  [`${pnpmLitPrefix}/lit-html@3.1.4/node_modules/lit-html/lit-html.mjs`]:
    "lit-html/lit-html.js",
  [`${pnpmLitPrefix}/lit-element@4.0.6/node_modules/lit-element/lit-element.mjs`]:
    "lit-element/lit-element.js",
  "@phosphor-icons/webcomponents/PhVault": reownIconStub,
  "@phosphor-icons/webcomponents/PhInfo": reownIconStub,
  "@phosphor-icons/webcomponents/PhLightbulb": reownIconStub,
  "@phosphor-icons/webcomponents/PhMagnifyingGlass": reownIconStub,
  "@phosphor-icons/webcomponents/PhPaperPlaneRight": reownIconStub,
  "@phosphor-icons/webcomponents/PhPlus": reownIconStub,
  "@phosphor-icons/webcomponents/PhPower": reownIconStub,
  "@phosphor-icons/webcomponents/PhPuzzlePiece": reownIconStub,
  "@phosphor-icons/webcomponents/PhQrCode": reownIconStub,
  "@phosphor-icons/webcomponents/PhQuestion": reownIconStub,
  "@phosphor-icons/webcomponents/PhQuestionMark": reownIconStub,
  "@phosphor-icons/webcomponents/PhSealCheck": reownIconStub,
  "@phosphor-icons/webcomponents/PhSignOut": reownIconStub,
  "@phosphor-icons/webcomponents/PhSpinner": reownIconStub,
  "@phosphor-icons/webcomponents/PhTrash": reownIconStub,
  "@phosphor-icons/webcomponents/PhUser": reownIconStub,
  "@phosphor-icons/webcomponents/PhWallet": reownIconStub,
  "@phosphor-icons/webcomponents/PhWarning": reownIconStub,
  "@phosphor-icons/webcomponents/PhWarningCircle": reownIconStub,
  "@phosphor-icons/webcomponents/PhX": reownIconStub,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@mezo-org/passport", "@mezo-org/orangekit"],
  turbopack: {
    root: __dirname,
    resolveAlias: resolveAliases,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...resolveAliases,
    }
    return config
  },
}

export default nextConfig
