import React from "react";
import { render, screen } from "@testing-library/react";
import Link from "../Link";

describe("resume | graphql | Link", () => {
  it("renders as expected", () => {
    render(<Link href="www.kennethbigler.com">Text</Link>);

    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByText("Text")).toHaveAttribute(
      "href",
      "www.kennethbigler.com"
    );
  });
});
