import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import Slots from ".";
import slotMachine, {
  spin,
  SlotDisplay,
  SlotOption as SO,
} from "./slotMachine";

const pullHandle = vi.spyOn(slotMachine, "pullHandle");

describe("games | slots | Slots", () => {
  it("renders as expected", () => {
    pullHandle.mockImplementation(() => [
      [SO.EMPTY, SO.EMPTY, SO.EMPTY],
      [SO.EMPTY, SO.BAR, SO.EMPTY],
      [SO.EMPTY, SO.EMPTY, SO.BAR],
    ]);
    render(<Slots />);

    expect(screen.getByText("Casino Slot Machine")).toBeInTheDocument();
    expect(screen.getByText("Spin")).toBeInTheDocument();
    // this is the spin button ^v
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(screen.getByText("Money")).toBeInTheDocument();
    expect(screen.getByText("Ken")).toBeInTheDocument();
    expect(screen.getByText("House")).toBeInTheDocument();
    expect(screen.getAllByText("$100")).toHaveLength(2);
    expect(screen.getByText("Slot Roll")).toBeInTheDocument();
    expect(screen.getByText("Payout")).toBeInTheDocument();
    expect(screen.getByText("1666 : 1")).toBeInTheDocument();
    expect(screen.getByText("300 : 1")).toBeInTheDocument();
    expect(screen.getByText("100 : 1")).toBeInTheDocument();
    expect(screen.getByText("50 : 1")).toBeInTheDocument();
    expect(screen.getByText("25 : 1")).toBeInTheDocument();
    expect(screen.getAllByText("12 : 1")).toHaveLength(2);
    expect(screen.getByText("6 : 1")).toBeInTheDocument();
    expect(screen.getByText("3 : 1")).toBeInTheDocument();
    // spin the button
    fireEvent.click(screen.getByText("Spin"));
    expect(screen.getByText("You ", { exact: false })).toBeInTheDocument();
    pullHandle.mockRestore();
  });

  describe("apis | slotMachine", () => {
    test("spin", () => {
      const result = spin();
      expect(result).toHaveLength(3);
      expect(Object.values(SO)).toContain(result[0]);
      expect(Object.values(SO)).toContain(result[1]);
      expect(Object.values(SO)).toContain(result[2]);
    });
    test("pullHandle", () => {
      const slotDisplay = slotMachine.pullHandle();
      expect(slotDisplay).toHaveLength(3);

      expect(slotDisplay[0]).toHaveLength(3);
      expect(slotDisplay[1]).toHaveLength(3);
      expect(slotDisplay[2]).toHaveLength(3);

      expect(Object.values(SO)).toContain(slotDisplay[0][0]);
      expect(Object.values(SO)).toContain(slotDisplay[0][1]);
      expect(Object.values(SO)).toContain(slotDisplay[0][2]);

      expect(Object.values(SO)).toContain(slotDisplay[1][0]);
      expect(Object.values(SO)).toContain(slotDisplay[1][1]);
      expect(Object.values(SO)).toContain(slotDisplay[1][2]);

      expect(Object.values(SO)).toContain(slotDisplay[2][0]);
      expect(Object.values(SO)).toContain(slotDisplay[2][1]);
      expect(Object.values(SO)).toContain(slotDisplay[2][2]);
    });
    describe("getPayout", () => {
      test("nothing", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(0);
      });

      test("3 cherries", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(12);
      });

      test("3 cherries with a larger bet", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 2);
        expect(res).toStrictEqual(24);
      });

      test("3 BARs", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.BAR, SO.EMPTY],
          [SO.EMPTY, SO.BAR, SO.EMPTY],
          [SO.EMPTY, SO.BAR, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(25);
      });

      test("3 Double BARs", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.DOUBLE_BAR, SO.EMPTY],
          [SO.EMPTY, SO.DOUBLE_BAR, SO.EMPTY],
          [SO.EMPTY, SO.DOUBLE_BAR, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(50);
      });

      test("3 Triple BARs", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.TRIPLE_BAR, SO.EMPTY],
          [SO.EMPTY, SO.TRIPLE_BAR, SO.EMPTY],
          [SO.EMPTY, SO.TRIPLE_BAR, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(100);
      });

      test("3 7s", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.SEVEN, SO.EMPTY],
          [SO.EMPTY, SO.SEVEN, SO.EMPTY],
          [SO.EMPTY, SO.SEVEN, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(300);
      });

      test("3 Jackpots", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.JACKPOT, SO.EMPTY],
          [SO.EMPTY, SO.JACKPOT, SO.EMPTY],
          [SO.EMPTY, SO.JACKPOT, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(1666);
      });

      test("3 of any BARs", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.BAR, SO.EMPTY],
          [SO.EMPTY, SO.DOUBLE_BAR, SO.EMPTY],
          [SO.EMPTY, SO.TRIPLE_BAR, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(12);
      });

      test("3 of any BARs v2", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.BAR, SO.EMPTY],
          [SO.EMPTY, SO.DOUBLE_BAR, SO.EMPTY],
          [SO.EMPTY, SO.DOUBLE_BAR, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(12);
      });

      test("2 Cherries", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(6);
      });

      test("2 Cherries v2", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(6);
      });

      test("2 Cherries v3", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(6);
      });

      test("1 Cherry", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(3);
      });

      test("1 Cherry v2", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(3);
      });

      test("1 Cherry v3", () => {
        const slotDisplay: SlotDisplay[] = [
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
          [SO.EMPTY, SO.EMPTY, SO.EMPTY],
          [SO.EMPTY, SO.CHERRY, SO.EMPTY],
        ];
        const res = slotMachine.getPayout(slotDisplay, 1);
        expect(res).toStrictEqual(3);
      });
    });
  });
});
