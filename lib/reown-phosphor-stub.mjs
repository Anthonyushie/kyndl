const tags = [
  "ph-vault",
  "ph-info",
  "ph-lightbulb",
  "ph-magnifying-glass",
  "ph-paper-plane-right",
  "ph-plus",
  "ph-power",
  "ph-puzzle-piece",
  "ph-qr-code",
  "ph-question",
  "ph-question-mark",
  "ph-seal-check",
  "ph-sign-out",
  "ph-spinner",
  "ph-trash",
  "ph-user",
  "ph-wallet",
  "ph-warning",
  "ph-warning-circle",
  "ph-x",
]

if (typeof customElements !== "undefined") {
  class KyndlPhosphorStub extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return
      const root = this.attachShadow({ mode: "open" })
      root.innerHTML = `
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      `
    }
  }

  for (const tag of tags) {
    if (!customElements.get(tag)) {
      customElements.define(tag, KyndlPhosphorStub)
    }
  }
}
