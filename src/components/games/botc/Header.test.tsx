import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./header/Header";

// Mock the constants import
vi.mock("../../../constants/botc", () => ({
  playerDist: {
    5: "5 players",
    6: "6 players",
    7: "7 players",
    8: "8 players",
  },
}));

// Mock the image import
vi.mock("../../../images/botc-qr-code.png", () => ({
  default: "mocked-qr-code.png",
}));

describe("BotC Header", () => {
  const defaultProps = {
    numPlayers: 5,
    numTravelers: 0,
  };

  it("should render the header with correct title", () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText("BotC")).toBeInTheDocument();
  });

  it("should display player distribution text", () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText("5 players")).toBeInTheDocument();
  });

  it("should display traveler count when present", () => {
    render(<Header {...defaultProps} numTravelers={2} />);

    expect(screen.getByText("5 players + 2")).toBeInTheDocument();
  });

  it("should not display traveler count when zero", () => {
    render(<Header {...defaultProps} numTravelers={0} />);

    expect(screen.getByText("5 players")).toBeInTheDocument();
    expect(screen.queryByText("+ 0")).not.toBeInTheDocument();
  });

  it("should render share button", () => {
    render(<Header {...defaultProps} />);

    const shareButton = screen.getByLabelText("share");
    expect(shareButton).toBeInTheDocument();
  });

  it("should open share dialog when share button is clicked", () => {
    render(<Header {...defaultProps} />);

    const shareButton = screen.getByLabelText("share");
    fireEvent.click(shareButton);

    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("should display QR code in share dialog", () => {
    render(<Header {...defaultProps} />);

    const shareButton = screen.getByLabelText("share");
    fireEvent.click(shareButton);

    const qrCode = screen.getByAltText("botc QR code");
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveAttribute("src", "mocked-qr-code.png");
  });

  it("should handle different player counts", () => {
    render(<Header {...defaultProps} numPlayers={8} />);

    expect(screen.getByText("8 players")).toBeInTheDocument();
  });

  it("should handle large traveler counts", () => {
    render(<Header {...defaultProps} numTravelers={10} />);

    expect(screen.getByText("5 players + 10")).toBeInTheDocument();
  });
});
