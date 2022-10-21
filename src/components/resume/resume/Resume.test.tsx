import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Resume from "./Resume";

describe("resume | resume", () => {
  it("renders as expected", async () => {
    const { container } = render(<Resume />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(
      screen.getByAltText("Kenneth Bigler Software Engineer Resume")
    ).toBeInTheDocument();
  });
});
