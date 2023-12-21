import { render, screen } from "@testing-library/react";
import Class from "../Class";

describe("common | edu-cards | Class", () => {
  it("renders with catalog", () => {
    render(<Class name="ClassName" catalog="CLSS 101" />);

    expect(screen.getByText("CLSS 101 -")).toBeInTheDocument();
    expect(screen.getByText("ClassName")).toBeInTheDocument();
  });

  it("renders without catalog", () => {
    render(<Class name="ClassName" />);

    expect(screen.queryByText(" -")).toBeNull();
    expect(screen.getByText("ClassName")).toBeInTheDocument();
  });
});
