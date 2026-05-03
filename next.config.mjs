import path from "node:path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@mezo-org/passport", "@mezo-org/orangekit"],
  webpack: (config) => {
    const pnpmLitPrefix = "../node_modules/.pnpm"
    const reownIconStub = path.resolve("lib/reown-phosphor-stub.mjs")
    config.resolve.alias = {
      ...config.resolve.alias,
      accounts: path.resolve("lib/accounts-stub.mjs"),
      [`${pnpmLitPrefix}/@lit_reactive-element@2.0.4/node_modules/@lit/reactive-element/reactive-element.mjs`]:
        path.resolve("node_modules/@lit/reactive-element/reactive-element.js"),
      [`${pnpmLitPrefix}/@lit_reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/custom-element.mjs`]:
        path.resolve("node_modules/@lit/reactive-element/decorators/custom-element.js"),
      [`${pnpmLitPrefix}/@lit_reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/property.mjs`]:
        path.resolve("node_modules/@lit/reactive-element/decorators/property.js"),
      [`${pnpmLitPrefix}/@lit_reactive-element@2.0.4/node_modules/@lit/reactive-element/css-tag.mjs`]:
        path.resolve("node_modules/@lit/reactive-element/css-tag.js"),
      [`${pnpmLitPrefix}/lit-html@3.1.4/node_modules/lit-html/lit-html.mjs`]:
        path.resolve("node_modules/lit-html/lit-html.js"),
      [`${pnpmLitPrefix}/lit-element@4.0.6/node_modules/lit-element/lit-element.mjs`]:
        path.resolve("node_modules/lit-element/lit-element.js"),
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
    return config
  },
}

export default nextConfig
