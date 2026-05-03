import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers"
import "dotenv/config"
import { defineConfig } from "hardhat/config"

const mezoTestnetAccounts = process.env.MEZO_TESTNET_PRIVATE_KEY ? [process.env.MEZO_TESTNET_PRIVATE_KEY] : []

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    mezoTestnet: {
      type: "http",
      chainType: "l1",
      url: process.env.MEZO_TESTNET_RPC_URL ?? "https://rpc.test.mezo.org",
      accounts: mezoTestnetAccounts,
    },
  },
})
