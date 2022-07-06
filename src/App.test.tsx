import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./wrappers/WithStore";

jest.mock("./components/Routes", () => () => <div>Loaded!</div>);

it("renders without crashing", () => {
  render(<App />);
  expect(screen.getByText("Loaded!")).toBeInTheDocument();
});
