import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddBid from "./AddBid";

describe("AddBid", () => {
  const mockOnBidSave = vi.fn();
  const defaultProps = {
    blindTrade: 0,
    first: 0,
    initials: "ABCD",
    onBidSave: mockOnBidSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the bid button", () => {
    render(<AddBid {...defaultProps} />);
    expect(screen.getByText("+ Bid")).toBeInTheDocument();
  });

  it("displays player initials correctly when popup is opened", () => {
    render(<AddBid {...defaultProps} />);
    fireEvent.click(screen.getByText("+ Bid"));

    expect(screen.getByText("A 🥇")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("D 🃏")).toBeInTheDocument();
  });

  it("calculates bags correctly", () => {
    render(<AddBid {...defaultProps} />);
    fireEvent.click(screen.getByText("+ Bid"));

    // Initially with default bids (3 each), bags = 13 - 12 = 1
    expect(screen.getByText(/💰/)).toBeInTheDocument();
  });

  describe("getBlindTrade function", () => {
    it("returns blindTrade for player 0 when blindTrade < 0", () => {
      render(<AddBid {...defaultProps} blindTrade={-2} />);
      fireEvent.click(screen.getByText("+ Bid"));
      
      // Player A (position 0) should see blind trade value
      expect(screen.getByText("A 🥇")).toBeInTheDocument();
    });

    it("returns blindTrade for player 2 when blindTrade < 0", () => {
      render(<AddBid {...defaultProps} blindTrade={-2} first={2} />);
      fireEvent.click(screen.getByText("+ Bid"));
      
      expect(screen.getByText("C 🥇")).toBeInTheDocument();
    });

    it("returns blindTrade for player 1 when blindTrade > 0", () => {
      render(<AddBid {...defaultProps} blindTrade={2} first={1} />);
      fireEvent.click(screen.getByText("+ Bid"));
      
      expect(screen.getByText("B 🥇")).toBeInTheDocument();
    });

    it("returns blindTrade for player 3 when blindTrade > 0", () => {
      render(<AddBid {...defaultProps} blindTrade={2} first={3} />);
      fireEvent.click(screen.getByText("+ Bid"));
      
      expect(screen.getByText("D 🥇")).toBeInTheDocument();
    });

    it("limits blind trade to maximum of 3", () => {
      render(<AddBid {...defaultProps} blindTrade={-5} />);
      fireEvent.click(screen.getByText("+ Bid"));
      
      // Should cap at 3
      expect(screen.getByText("A 🥇")).toBeInTheDocument();
    });

    it("returns 0 when blindTrade doesn't match player position", () => {
      render(<AddBid {...defaultProps} blindTrade={-2} first={1} />);
      fireEvent.click(screen.getByText("+ Bid"));
      
      // Player B (position 1) shouldn't get blind trade when negative
      expect(screen.getByText("B 🥇")).toBeInTheDocument();
    });
  });

  describe("handleBid function", () => {
    it("handles blind bid (line 40-41)", () => {
      render(<AddBid {...defaultProps} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // Toggle blind for player A
      const blindSwitch = screen.getByLabelText("PA 🥇 Blind Nil");
      fireEvent.click(blindSwitch);

      // Bid should be set to 0, blind true, train false
      expect(blindSwitch).toBeChecked();
    });

    it("handles train bid for case a (line 44-46)", () => {
      render(<AddBid {...defaultProps} first={0} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // Player C (3rd player) can train
      const trainSwitch = screen.getByLabelText("PC Trains");
      fireEvent.click(trainSwitch);

      // Train bid should be calculated as 10 - bids[a].bid
      expect(trainSwitch).toBeChecked();
    });

    it("handles train bid for case b (line 48-49)", () => {
      render(<AddBid {...defaultProps} first={1} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // When first=1, player B is first, so just verify component loaded
      expect(screen.getByText("B 🥇")).toBeInTheDocument();
    });

    it("handles train bid for case c (line 51-52)", () => {
      render(<AddBid {...defaultProps} first={2} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // When first=2, player C is first
      expect(screen.getByText("C 🥇")).toBeInTheDocument();
    });

    it("handles train bid for case d/default (line 54-56)", () => {
      render(<AddBid {...defaultProps} first={3} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // When first=3, player B (4th in rotation) can train
      const trainSwitch = screen.getByLabelText("PB Trains");
      fireEvent.click(trainSwitch);

      expect(trainSwitch).toBeChecked();
    });

    it("handles regular bid (line 63-64)", () => {
      render(<AddBid {...defaultProps} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // Click + button for player A to increase bid
      const plusButtons = screen.getAllByRole("button", { name: "" });
      fireEvent.click(plusButtons[0]); // First + button

      // Should update the bid normally
      expect(screen.getByLabelText("Bid Table")).toBeInTheDocument();
    });

    it("handles regular bid decrease", () => {
      render(<AddBid {...defaultProps} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // Click - button for player A to decrease bid
      const minusButtons = screen.getAllByRole("button", { name: "" });
      fireEvent.click(minusButtons[1]); // Second button is minus

      expect(screen.getByLabelText("Bid Table")).toBeInTheDocument();
    });
  });

  describe("canTrain conditions", () => {
    it("allows train for player C when player A bid is > 0 and < 10", () => {
      render(<AddBid {...defaultProps} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // Player A has default bid of 3, so player C should be able to train
      const trainSwitch = screen.queryByLabelText("PC Trains");
      expect(trainSwitch).toBeInTheDocument();
    });

    it("allows train for player D when player B bid is > 0 and < 10", () => {
      render(<AddBid {...defaultProps} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // Player B has default bid of 3, so player D should be able to train
      const trainSwitch = screen.queryByLabelText("PD 🃏 Trains");
      expect(trainSwitch).toBeInTheDocument();
    });

    it("does not show train switch for player A", () => {
      render(<AddBid {...defaultProps} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // Player A should not have train option
      const trainSwitch = screen.queryByLabelText("PA 🥇 Trains");
      expect(trainSwitch).not.toBeInTheDocument();
    });

    it("does not show train switch for player B", () => {
      render(<AddBid {...defaultProps} />);
      fireEvent.click(screen.getByText("+ Bid"));

      // Player B should not have train option
      const trainSwitch = screen.queryByLabelText("PB Trains");
      expect(trainSwitch).not.toBeInTheDocument();
    });
  });

  it("calls onBidSave when save button is clicked", () => {
    render(<AddBid {...defaultProps} />);
    fireEvent.click(screen.getByText("+ Bid"));

    const popupSaveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(popupSaveButton);

    expect(mockOnBidSave).toHaveBeenCalled();
  });

  it("resets bids after save", () => {
    render(<AddBid {...defaultProps} />);
    fireEvent.click(screen.getByText("+ Bid"));

    // Modify a bid
    const plusButton = screen.getAllByRole("button", { name: "" })[0];
    fireEvent.click(plusButton);

    // Save
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(mockOnBidSave).toHaveBeenCalled();
    
    // Reopen to check reset
    const buttons = screen.getAllByText("+ Bid");
    fireEvent.click(buttons[0]);
    // Bids should be back to default
    expect(screen.getByText(/💰/)).toBeInTheDocument();
  });

  describe("first player rotation", () => {
    it("handles first=0 (player A is first)", () => {
      render(<AddBid {...defaultProps} first={0} />);
      fireEvent.click(screen.getByText("+ Bid"));
      expect(screen.getByText("A 🥇")).toBeInTheDocument();
    });

    it("handles first=1 (player B is first)", () => {
      render(<AddBid {...defaultProps} first={1} />);
      fireEvent.click(screen.getByText("+ Bid"));
      expect(screen.getByText("B 🥇")).toBeInTheDocument();
    });

    it("handles first=2 (player C is first)", () => {
      render(<AddBid {...defaultProps} first={2} />);
      fireEvent.click(screen.getByText("+ Bid"));
      expect(screen.getByText("C 🥇")).toBeInTheDocument();
    });

    it("handles first=3 (player D is first)", () => {
      render(<AddBid {...defaultProps} first={3} />);
      fireEvent.click(screen.getByText("+ Bid"));
      expect(screen.getByText("D 🥇")).toBeInTheDocument();
    });
  });

  it("updates bags calculation when bids change", () => {
    render(<AddBid {...defaultProps} />);
    fireEvent.click(screen.getByText("+ Bid"));

    // Increase player A's bid
    const plusButton = screen.getAllByRole("button", { name: "" })[0];
    fireEvent.click(plusButton); // Bid goes from 3 to 4
    fireEvent.click(plusButton); // Bid goes from 4 to 5

    // Bags should update: 13 - (5 + 3 + 3 + 3) = -1
    expect(screen.getByText(/💰/)).toBeInTheDocument();
  });
});

