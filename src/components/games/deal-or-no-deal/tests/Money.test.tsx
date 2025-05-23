import { render, screen } from "@testing-library/react";
import Money from "../Money";

describe("games | deal-or-no-deal | Money", () => {
  it("displays gold when on", () => {
    render(<Money on val={1000} />);

    expect(screen.getByText("$1,000")).toHaveStyle({
      backgroundColor: "rgb(255, 193, 7)",
    });
  });

  it("displays grey when off", () => {
    render(<Money on={false} val={1000} />);

    expect(screen.getByText("$1,000").parentElement).toHaveStyle({
      backgroundColor: "rgb(97, 97, 97)",
    });
  });
});
