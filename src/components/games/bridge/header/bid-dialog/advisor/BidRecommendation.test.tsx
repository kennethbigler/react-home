import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BidRecommendation from "./BidRecommendation";
import type { BidRecommendation as BidRecommendationType } from "./bidding-logic";

const baseRec: BidRecommendationType = {
  bid: "1NT",
  category: "Opening 1NT (15-17 HCP)",
  reasoning: "With 15-17 HCP and a balanced hand you open 1NT.",
  handAnalysis: {
    tp: 15,
    hcp: 15,
    isBalanced: true,
    longestSuitName: "spades",
    longestSuitLength: 4,
    hasFiveCardMajor: false,
    hasVoid: false,
    description: "15 TP (15 HCP), balanced",
  },
  whatYourBidTellsPartner: "Exactly 15-17 HCP, balanced.",
  expectedResponses: [
    { partnerBid: "Pass", meaning: "0-7 pts balanced" },
    {
      partnerBid: "2♣",
      meaning: "Stayman",
      yourRebid: "Reply with major or 2♦",
    },
  ],
  confidence: "high",
};

describe("games | bridge | BidRecommendation", () => {
  it("renders the component heading", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByText("Recommended Bid")).toBeInTheDocument();
  });

  it("renders the recommended bid", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByLabelText("Recommended bid")).toHaveTextContent("1NT");
  });

  it("renders the category", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByText("Opening 1NT (15-17 HCP)")).toBeInTheDocument();
  });

  it("renders the reasoning", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByText(/With 15-17 HCP/)).toBeInTheDocument();
  });

  it("renders hand analysis", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByText("Your Hand Analysis")).toBeInTheDocument();
    expect(screen.getByText(/15 TP/)).toBeInTheDocument();
  });

  it("renders what-it-tells-partner", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByText(/Exactly 15-17 HCP, balanced/)).toBeInTheDocument();
  });

  it("renders confidence badge with high confidence", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByLabelText("Confidence level: high")).toBeInTheDocument();
  });

  it("renders confidence badge with medium confidence", () => {
    render(
      <BidRecommendation
        recommendation={{ ...baseRec, confidence: "medium" }}
      />,
    );
    expect(
      screen.getByLabelText("Confidence level: medium"),
    ).toBeInTheDocument();
  });

  it("renders confidence badge with low confidence", () => {
    render(
      <BidRecommendation recommendation={{ ...baseRec, confidence: "low" }} />,
    );
    expect(screen.getByLabelText("Confidence level: low")).toBeInTheDocument();
  });

  it("renders expected partner responses accordion", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByText(/Expected Partner Responses/)).toBeInTheDocument();
    expect(screen.getByText(/\(2\)/)).toBeInTheDocument();
  });

  it("shows expected responses when accordion is expanded", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    const accordionHeader = screen.getByRole("button", {
      name: /Expected Partner Responses/i,
    });
    fireEvent.click(accordionHeader);
    expect(screen.getByText("Pass")).toBeInTheDocument();
    expect(screen.getByText("0-7 pts balanced")).toBeInTheDocument();
    expect(screen.getByText("2♣")).toBeInTheDocument();
  });

  it("shows yourRebid when present in expected response", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    const accordionHeader = screen.getByRole("button", {
      name: /Expected Partner Responses/i,
    });
    fireEvent.click(accordionHeader);
    expect(screen.getByText(/Reply with major or 2♦/)).toBeInTheDocument();
  });

  it("does NOT render note section when note is absent", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("renders note section when note is present", () => {
    const recWithNote: BidRecommendationType = {
      ...baseRec,
      note: "Be careful with this bid.",
    };
    render(<BidRecommendation recommendation={recWithNote} />);
    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent(
      "Be careful with this bid.",
    );
  });

  it("does NOT render alternative bid when absent", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.queryByText("Alternative Bid")).not.toBeInTheDocument();
  });

  it("renders alternative bid when present", () => {
    const recWithAlt: BidRecommendationType = {
      ...baseRec,
      alternativeBid: "2♣ (Stayman)",
    };
    render(<BidRecommendation recommendation={recWithAlt} />);
    expect(screen.getByText("Alternative Bid")).toBeInTheDocument();
    expect(screen.getByText("2♣ (Stayman)")).toBeInTheDocument();
  });

  it("does NOT render accordion when no expected responses", () => {
    const recNoResponses: BidRecommendationType = {
      ...baseRec,
      expectedResponses: [],
    };
    render(<BidRecommendation recommendation={recNoResponses} />);
    expect(
      screen.queryByRole("button", { name: /Expected Partner Responses/i }),
    ).not.toBeInTheDocument();
  });

  it("renders all three sections: reasoning, what-it-tells, analysis", () => {
    render(<BidRecommendation recommendation={baseRec} />);
    expect(screen.getByText("Why This Bid")).toBeInTheDocument();
    expect(screen.getByText("What It Tells Partner")).toBeInTheDocument();
    expect(screen.getByText("Your Hand Analysis")).toBeInTheDocument();
  });
});
