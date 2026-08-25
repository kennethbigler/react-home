// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const isBrokenStorage = (storage: unknown): boolean =>
  storage === null ||
  storage === undefined ||
  typeof (storage as Storage).setItem !== "function";

const createStorage = (): Storage => {
  let store: Record<string, string> = {};

  return {
    get length() {
      return Object.keys(store).length;
    },
    clear: () => {
      store = {};
    },
    getItem: (key: string) => (key in store ? store[key] : null),
    key: (index: number) => Object.keys(store)[index] ?? null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
  };
};

// Node 25+ exposes a broken global localStorage stub that prevents jsdom from
// installing a working Storage implementation (breaks jotai atomWithStorage).
if (isBrokenStorage(globalThis.localStorage)) {
  const storage = createStorage();
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, "localStorage", {
    value: storage,
    writable: true,
    configurable: true,
  });
}

if (isBrokenStorage(globalThis.sessionStorage)) {
  const storage = createStorage();
  Object.defineProperty(globalThis, "sessionStorage", {
    value: storage,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, "sessionStorage", {
    value: storage,
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// for checks on if dark mode is preferred
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({ matches: false })),
});

// highcharts v12.2.0 required adding this
vi.stubGlobal("CSS", {
  supports: vi.fn().mockImplementation(() => {
    return true;
  }),
  escape: (ident: string) =>
    ident.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`),
});

// Mock image loading to prevent timeouts in CI
// Images in jsdom don't trigger onload events automatically
beforeEach(() => {
  // Override Image constructor to simulate instant loading
  const MockImage = class {
    onload: ((this: GlobalEventHandlers, ev: Event) => unknown) | null = null;
    onerror: ((this: GlobalEventHandlers, ev: Event) => unknown) | null = null;
    src = "";
    alt = "";
    width = 0;
    height = 0;

    constructor() {
      // Trigger onload asynchronously to prevent waiting
      queueMicrotask(() => {
        if (this.onload) {
          // Call without 'this' binding to avoid type issues
          const event = new Event("load");
          (this.onload as (ev: Event) => unknown)(event);
        }
      });
    }

    get complete() {
      return true;
    }

    get naturalWidth() {
      return this.width || 100;
    }

    get naturalHeight() {
      return this.height || 100;
    }
  };

  // @ts-expect-error - Mocking Image for testing
  window.Image = MockImage;
});
