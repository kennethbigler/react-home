module.exports = {
  ci: {
    collect: {
      staticDistDir: "./build"
    },
    upload: {
      githubToken: process.env.LHCI_GITHUB_TOKEN,
      target: "temporary-public-storage"
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "csp-xss": "warn",
        "non-composited-animations": "warn",
        "preload-lcp-image": "warn",
        "unsized-images": "warn",
        "unused-javascript": "warn",
        "uses-responsive-images": "warn"
      }
    }
  }
};
