import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./wrappers/WithStore";

jest.mock("./components/resume/travel-map/WorldMap", () => () => <div />);

it("renders without crashing", () => {
  render(<App />);
  expect(screen.getByTitle("Loading Spinner")).toBeInTheDocument();
  // TODO: Await actual load then run axe-jest here
  jest.clearAllMocks();
});
