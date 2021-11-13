import React from "react";
import { render, screen } from "@testing-library/react";
import Resume from "./Resume";

describe("resume | resume", () => {
  it("renders as expected", () => {
    render(<Resume />);

    expect(
      screen.getByAltText("Kenneth Bigler Software Engineer Resume")
    ).toBeInTheDocument();
  });
});
