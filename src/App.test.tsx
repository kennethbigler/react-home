import { render, screen } from "@testing-library/react";
import App from "./wrappers/WithStore";

it("renders without crashing", () => {
  render(<App />);
  expect(screen.getByTitle("Loading Spinner")).toBeInTheDocument();
});
