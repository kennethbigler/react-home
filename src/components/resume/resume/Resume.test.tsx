import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Resume from "./Resume";

describe("resume | resume", () => {
  it("passes axe", async () => {
    const { container } = render(<Resume />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders as expected", () => {
    render(<Resume />);

    expect(
      screen.getByAltText("Kenneth Bigler Software Engineer Resume")
    ).toBeInTheDocument();
  });
});
