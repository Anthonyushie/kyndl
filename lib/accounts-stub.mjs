export const Provider = {
  create() {
    throw new Error("Tempo accounts connector is not configured in this app.")
  },
}

export function dialog() {
  throw new Error("Tempo accounts connector is not configured in this app.")
}

export function webAuthn() {
  throw new Error("WebAuthn accounts connector is not configured in this app.")
}

export function dangerous_secp256k1() {
  throw new Error("Secp256k1 accounts connector is not configured in this app.")
}
