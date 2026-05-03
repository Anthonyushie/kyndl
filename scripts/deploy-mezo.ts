import "dotenv/config"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { network } from "hardhat"

const { ethers } = await network.create()

const [deployer] = await ethers.getSigners()
const musdAddress = process.env.MEZO_TESTNET_MUSD_ADDRESS ?? process.env.NEXT_PUBLIC_MUSD_ADDRESS

if (!musdAddress) {
  throw new Error("Set MEZO_TESTNET_MUSD_ADDRESS or NEXT_PUBLIC_MUSD_ADDRESS before deploying.")
}

console.log("Deploying KyndlRegistry to Mezo Testnet")
console.log("Deployer:", deployer.address)
console.log("MUSD:", musdAddress)

const registry = await ethers.deployContract("KyndlRegistry", [musdAddress, deployer.address])
await registry.waitForDeployment()

const registryAddress = await registry.getAddress()
console.log("KyndlRegistry:", registryAddress)

const output = {
  network: "mezoTestnet",
  chainId: 31611,
  paymentToken: musdAddress,
  registry: registryAddress,
  deployer: deployer.address,
  deployedAt: new Date().toISOString(),
}

const outputPath = join(process.cwd(), "deployments", "mezo-testnet.json")
await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`)

console.log("Wrote deployment info:", outputPath)
