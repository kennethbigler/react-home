import React from "react";
import MenuItem from "@mui/material/MenuItem";
import { screen, fireEvent } from "@testing-library/react";
import render from "../../../../redux-test-render";
import BranchName from "../BranchName";

describe("resume | git-tools | BranchName", () => {
  const getSelectOptions = jest
    .fn()
    .mockReturnValueOnce([
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
    ])
    .mockReturnValueOnce([
      <MenuItem key="1" value="snake_case">
        snake_case
      </MenuItem>,
      <MenuItem key="2" value="kebab-case">
        kebab-case
      </MenuItem>,
      <MenuItem key="3" value="camelCase">
        camelCase
      </MenuItem>,
      <MenuItem key="4" value="No Changes">
        No Changes
      </MenuItem>,
    ]);
  const handleCopy = jest.fn();

  beforeEach(() => {
    render(
      <BranchName
        gitTheme="orange"
        getSelectOptions={getSelectOptions}
        handleCopy={handleCopy}
      />
    );
  });

  it("renders as expected", () => {
    expect(screen.getByText("Branch Prefix")).toBeInTheDocument();
    expect(screen.getByText("Case Preference")).toBeInTheDocument();
    expect(screen.getAllByText("Branch Name")).toHaveLength(2);
    expect(screen.getByDisplayValue("features")).toBeInTheDocument();
    expect(screen.getByDisplayValue("snake_case")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(4);

    expect(getSelectOptions).toHaveBeenCalledTimes(2);
    expect(getSelectOptions).toHaveBeenCalledWith([
      "chores",
      "epics",
      "features",
      "fixes",
    ]);
    expect(getSelectOptions).toHaveBeenLastCalledWith([
      "snake_case",
      "kebab-case",
      "camelCase",
      "No Changes",
    ]);
  });

  it("calls onBranchMessageChange when Branch Name is changed and clears on button press", () => {
    expect(screen.queryByText("test")).toBeNull();
    fireEvent.change(screen.getByLabelText("Branch Name"), {
      target: { value: "test" },
    });
    expect(screen.getByText("test")).toBeInTheDocument();
    // ensure it clears
    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(screen.queryByText("test")).toBeNull();
  });

  it("calls handleCopy on click of BranchName", () => {
    expect(handleCopy).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole("button")[3]);
    expect(handleCopy).toHaveBeenCalledWith("features/");
  });
});
