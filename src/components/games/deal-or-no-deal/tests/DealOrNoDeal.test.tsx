import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DealOrNoDeal from "..";

describe("games | deal-or-no-deal | DealOrNoDeal", () => {
  it("renders as expected", () => {
    render(<DealOrNoDeal />);

    expect(screen.getByText("Deal or No Deal")).toBeInTheDocument();
    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(27);
  });

  it("plays a game and takes a deal", async () => {
    render(<DealOrNoDeal />);

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(27);

    // select case 7
    fireEvent.click(buttons[7]);

    expect(screen.getByText("Your Case: 7")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();

    // open cases 1-6
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[4]);
    fireEvent.click(buttons[5]);
    fireEvent.click(buttons[6]);
    // this one should not open
    fireEvent.click(buttons[8]);

    await waitFor(() => screen.getByText("Deal"));
    expect(screen.getByText("No Deal")).toBeInTheDocument();
    // there should only be 2 buttons now
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getAllByText("$1")).toBeDefined();
    expect(screen.getAllByText("$1,000")).toBeDefined();
    expect(screen.getAllByText("$1,000,000")).toBeDefined();

    fireEvent.click(screen.getByText("No Deal"));

    await waitFor(() => screen.getByText("Number of Cases to Open: 5"));
    // open cases 8-12
    fireEvent.click(buttons[8]);
    fireEvent.click(buttons[9]);
    fireEvent.click(buttons[10]);
    fireEvent.click(buttons[11]);
    fireEvent.click(buttons[12]);

    await waitFor(() => screen.getByText("Deal"));
    expect(screen.getByText("No Deal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Deal"));

    await waitFor(() => screen.getByText("New Game"));
    fireEvent.click(screen.getByText("New Game"));

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
  });

  it("plays a game and swaps at the end", async () => {
    render(<DealOrNoDeal />);

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(27);

    // select case 7
    fireEvent.click(buttons[7]);

    expect(screen.getByText("Your Case: 7")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();

    // open cases 1-6
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[4]);
    fireEvent.click(buttons[5]);
    fireEvent.click(buttons[6]);
    // this one should not open
    fireEvent.click(buttons[8]);
    await waitFor(() => screen.getByText("Deal"));
    expect(screen.getByText("No Deal")).toBeInTheDocument();
    // there should only be 2 buttons now
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getAllByText("$1")).toBeDefined();
    expect(screen.getAllByText("$1,000")).toBeDefined();
    expect(screen.getAllByText("$1,000,000")).toBeDefined();
    fireEvent.click(screen.getByText("No Deal"));

    // open cases 8-12
    await waitFor(() => screen.getByText("Number of Cases to Open: 5"));
    fireEvent.click(buttons[8]);
    fireEvent.click(buttons[9]);
    fireEvent.click(buttons[10]);
    fireEvent.click(buttons[11]);
    fireEvent.click(buttons[12]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open cases 13-16
    await waitFor(() => screen.getByText("Number of Cases to Open: 4"));
    fireEvent.click(buttons[13]);
    fireEvent.click(buttons[14]);
    fireEvent.click(buttons[15]);
    fireEvent.click(buttons[16]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open cases 17-19
    await waitFor(() => screen.getByText("Number of Cases to Open: 3"));
    fireEvent.click(buttons[17]);
    fireEvent.click(buttons[18]);
    fireEvent.click(buttons[19]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open cases 20-21
    await waitFor(() => screen.getByText("Number of Cases to Open: 2"));
    fireEvent.click(buttons[20]);
    fireEvent.click(buttons[21]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open case 22
    await waitFor(() => screen.getByText("Number of Cases to Open: 1"));
    fireEvent.click(buttons[22]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open case 23
    await waitFor(() => screen.getByText("Number of Cases to Open: 1"));
    fireEvent.click(buttons[23]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open case 24
    await waitFor(() => screen.getByText("Number of Cases to Open: 1"));
    fireEvent.click(buttons[24]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open case 25
    await waitFor(() => screen.getByText("Number of Cases to Open: 1"));
    fireEvent.click(buttons[25]);
    await waitFor(() => screen.getByText("Deal"));

    // swap
    expect(screen.getByText("My Case")).toBeInTheDocument();
    expect(screen.getByText("Other Case")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Other Case"));
    fireEvent.click(screen.getByText("New Game"));
  });

  it("plays a game and never takes a deal", async () => {
    render(<DealOrNoDeal />);

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(27);

    // select case 7
    fireEvent.click(buttons[7]);

    expect(screen.getByText("Your Case: 7")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();

    // open cases 1-6
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[4]);
    fireEvent.click(buttons[5]);
    fireEvent.click(buttons[6]);
    // this one should not open
    fireEvent.click(buttons[8]);
    await waitFor(() => screen.getByText("Deal"));
    expect(screen.getByText("No Deal")).toBeInTheDocument();
    // there should only be 2 buttons now
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getAllByText("$1")).toBeDefined();
    expect(screen.getAllByText("$1,000")).toBeDefined();
    expect(screen.getAllByText("$1,000,000")).toBeDefined();
    fireEvent.click(screen.getByText("No Deal"));

    // open cases 8-12
    await waitFor(() => screen.getByText("Number of Cases to Open: 5"));
    fireEvent.click(buttons[8]);
    fireEvent.click(buttons[9]);
    fireEvent.click(buttons[10]);
    fireEvent.click(buttons[11]);
    fireEvent.click(buttons[12]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open cases 13-16
    await waitFor(() => screen.getByText("Number of Cases to Open: 4"));
    fireEvent.click(buttons[13]);
    fireEvent.click(buttons[14]);
    fireEvent.click(buttons[15]);
    fireEvent.click(buttons[16]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open cases 17-19
    await waitFor(() => screen.getByText("Number of Cases to Open: 3"));
    fireEvent.click(buttons[17]);
    fireEvent.click(buttons[18]);
    fireEvent.click(buttons[19]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open cases 20-21
    await waitFor(() => screen.getByText("Number of Cases to Open: 2"));
    fireEvent.click(buttons[20]);
    fireEvent.click(buttons[21]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open case 22
    await waitFor(() => screen.getByText("Number of Cases to Open: 1"));
    fireEvent.click(buttons[22]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open case 23
    await waitFor(() => screen.getByText("Number of Cases to Open: 1"));
    fireEvent.click(buttons[23]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open case 24
    await waitFor(() => screen.getByText("Number of Cases to Open: 1"));
    fireEvent.click(buttons[24]);
    await waitFor(() => screen.getByText("Deal"));
    fireEvent.click(screen.getByText("No Deal"));

    // open case 25
    await waitFor(() => screen.getByText("Number of Cases to Open: 1"));
    fireEvent.click(buttons[25]);
    await waitFor(() => screen.getByText("Deal"));

    // swap
    expect(screen.getByText("My Case")).toBeInTheDocument();
    expect(screen.getByText("Other Case")).toBeInTheDocument();
    fireEvent.click(screen.getByText("My Case"));
  });
});
