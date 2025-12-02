// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import "@testing-library/jest-dom";

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
