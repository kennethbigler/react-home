import { render, screen } from "@testing-library/react";
import App from "./wrappers/WithTheme";

it("renders without crashing", () => {
  render(<App />);
  expect(screen.getByTitle("Loading Spinner")).toBeInTheDocument();
});
