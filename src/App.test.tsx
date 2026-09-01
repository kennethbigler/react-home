import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";

it("renders without crashing", async () => {
  render(<App />);
  expect(
    screen.getByRole("progressbar", { name: "Loading" }),
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByLabelText("Menu")).toBeInTheDocument(),
  );

  // verify menu closed, then open menu and verify it's open
  expect(screen.queryByLabelText("Games")).toBeNull();
  fireEvent.click(screen.getByLabelText("Menu"));
  await waitFor(() => expect(screen.getByText("Games")).toBeInTheDocument());

  // navigate to games page and verify
  expect(screen.queryByText("Deduction")).toBeNull();
  fireEvent.click(screen.getByText("Games"));
  // Drawer keeps menu items mounted until the close transition ends.
  await waitFor(() => {
    expect(screen.getByText("Deduction")).toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "BotC" }),
    ).not.toBeInTheDocument();
  });

  // verify menu closed, then open menu and verify it's open
  expect(screen.getAllByText("BotC")).toHaveLength(1);
  fireEvent.click(screen.getByLabelText("Menu"));
  await waitFor(() => expect(screen.getAllByText("BotC")).toHaveLength(2));

  // navigate to BotC game page and verify
  expect(screen.queryByRole("button", { name: "Share" })).toBeNull();
  fireEvent.click(screen.getAllByText("BotC")[1]);
  await waitFor(
    () =>
      expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument(),
    { timeout: 5000 },
  );
});
