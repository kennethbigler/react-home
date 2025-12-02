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
// Images in jsdom don't trigger onload events automatically, which can cause
// tests with many images to hang or timeout
beforeEach(() => {
  // Store the original Image constructor
  const OriginalImage = window.Image;

  // Mock the Image constructor to immediately trigger onload
  class MockImage extends OriginalImage {
    constructor(width?: number, height?: number) {
      super(width, height);
      // Simulate successful image load asynchronously
      // This prevents tests from waiting for real image loading
      setTimeout(() => {
        if (this.onload) {
          this.onload(new Event("load"));
        }
      }, 0);
    }
  }

  window.Image = MockImage as typeof Image;
});
