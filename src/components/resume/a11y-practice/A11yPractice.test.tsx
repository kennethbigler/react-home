import { render, screen } from "@testing-library/react";
import A11yPractice from "./A11yPractice";

describe("resume | a11y-practice | A11yPractice", () => {
  it("renders the page heading and screen-reader-only status", () => {
    render(<A11yPractice />);

    expect(
      screen.getByRole("heading", { level: 1, name: "A11y Practice" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Stream Content")).toBeInTheDocument();

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Content Read by SR");
    expect(status).toHaveClass("sr-only");
  });
});
