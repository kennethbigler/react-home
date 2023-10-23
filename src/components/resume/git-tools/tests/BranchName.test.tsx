import MenuItem from "@mui/material/MenuItem";
import { screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import render from "../../../../recoil-test-render";
import BranchName from "../BranchName";

describe("resume | git-tools | BranchName", () => {
  const getSelectOptions = vi.fn().mockReturnValue([
    <MenuItem key="1" value="chores">
      chores
    </MenuItem>,
    <MenuItem key="2" value="epics">
      epics
    </MenuItem>,
    <MenuItem key="3" value="features">
      features
    </MenuItem>,
    <MenuItem key="4" value="fixes">
      fixes
    </MenuItem>,
  ]);

  beforeEach(() => {
    render(
      <BranchName gitTheme="orange" getSelectOptions={getSelectOptions} />,
    );
  });

  it("renders as expected", () => {
    expect(screen.getByText("Branch Prefix")).toBeInTheDocument();
    expect(screen.getAllByText("Branch Name")).toHaveLength(2);
    expect(screen.getByDisplayValue("features")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);

    expect(getSelectOptions).toHaveBeenCalledTimes(1);
    expect(getSelectOptions).toHaveBeenCalledWith([
      "chores",
      "epics",
      "features",
      "fixes",
    ]);
  });

  it("calls onBranchMessageChange when Branch Name is changed and clears on button press", () => {
    expect(screen.queryByText("test")).toBeNull();
    fireEvent.change(screen.getByLabelText("Branch Name"), {
      target: { value: "test" },
    });
    expect(screen.getByText("test")).toBeInTheDocument();
    // ensure it clears
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.queryByText("test")).toBeNull();
  });
});
