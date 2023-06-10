import MenuItem from "@mui/material/MenuItem";
import { screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import render from "../../../../recoil-test-render";
import CommitText from "../CommitText";

describe("resume | git-tools | CommitText", () => {
  let handleSelectOptions;

  beforeEach(() => {
    handleSelectOptions = vi.fn().mockReturnValue([
      <MenuItem key="1" value="feat">
        feat
      </MenuItem>,
      <MenuItem key="2" value="test">
        test
      </MenuItem>,
    ]);

    render(
      <CommitText
        getSelectOptions={handleSelectOptions}
        gitTheme="red"
        storyID="KEN-1234"
      />
    );
  });

  it("renders as expected", () => {
    expect(screen.getByText("Commit Prefix")).toBeInTheDocument();
    expect(screen.getByDisplayValue("feat")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(4);
    expect(screen.getByText("Finishes User Story")).toBeInTheDocument();
    expect(screen.getByText("Add git commit -m")).toBeInTheDocument();
    expect(screen.getAllByText("Commit Message")).toHaveLength(2);
    expect(screen.getAllByText("Commit Description")).toHaveLength(2);
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
  });

  it("has expected color", () => {
    expect(screen.getByText("Commit Prefix")).toHaveStyle(
      "color: rgb(255, 0, 0);"
    );
    expect(screen.getAllByText("Commit Message")[0]).toHaveStyle(
      "color: rgb(255, 0, 0);"
    );
    expect(screen.getAllByText("Commit Description")[0]).toHaveStyle(
      "color: rgb(255, 0, 0);"
    );
  });

  it("adds git commit prefix on toggle", () => {
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue("Add git commit -m"));
    expect(screen.getByText("feat: [KEN-1234]")).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue("Add git commit -m"));
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
  });

  it("adds a finishes tag on toggle", () => {
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue("Finishes User Story"));
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234 #finish]"')
    ).toBeInTheDocument();
  });

  it("swaps commit prefix on select", () => {
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("feat")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("test")).toBeNull();
    fireEvent.change(screen.getByDisplayValue("feat"), {
      target: { value: "test" },
    });
    expect(screen.queryByDisplayValue("feat")).toBeNull();
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
    expect(
      screen.getByText('git commit -m "test: [KEN-1234]"')
    ).toBeInTheDocument();
  });

  it("updates output with changes to commit message text and can clear out the text", () => {
    expect(screen.getAllByText("Commit Message")).toHaveLength(2);
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
    // Add commit message
    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("Commit Message")[0].nextSibling!.firstChild!,
      { target: { value: "A Message" } }
    );
    expect(
      screen.getByText('git commit -m "feat: A Message [KEN-1234]"')
    ).toBeInTheDocument();
    // Remove commit message
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
  });

  it("updates output with changes to commit description text and can clear out the text", () => {
    expect(screen.getAllByText("Commit Description")).toHaveLength(2);
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
    // Add commit description
    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("Commit Description")[0].nextSibling!.firstChild!,
      { target: { value: "A Description" } }
    );
    expect(screen.getByText('git commit -m "feat:')).toBeInTheDocument();
    expect(screen.getAllByText("A Description")).toHaveLength(2);
    expect(screen.getByText('[KEN-1234]"')).toBeInTheDocument();
    // Remove commit description
    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
  });

  it("supports all ui features", () => {
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
    // Remove git wrapper text
    fireEvent.click(screen.getByDisplayValue("Add git commit -m"));
    expect(screen.getByText("feat: [KEN-1234]")).toBeInTheDocument();
    // Add git wrapper text
    fireEvent.click(screen.getByDisplayValue("Add git commit -m"));
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
    // Add a finish tag
    fireEvent.click(screen.getByDisplayValue("Finishes User Story"));
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234 #finish]"')
    ).toBeInTheDocument();
    // Change the commit prefix
    expect(screen.getByDisplayValue("feat")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("test")).toBeNull();
    fireEvent.change(screen.getByDisplayValue("feat"), {
      target: { value: "test" },
    });
    expect(screen.queryByDisplayValue("feat")).toBeNull();
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
    expect(
      screen.getByText('git commit -m "test: [KEN-1234 #finish]"')
    ).toBeInTheDocument();
    // Add a commit message
    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("Commit Message")[0].nextSibling!.firstChild!,
      { target: { value: "A Message" } }
    );
    expect(
      screen.getByText('git commit -m "test: A Message [KEN-1234 #finish]"')
    ).toBeInTheDocument();
    // Add a commit description
    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("Commit Description")[0].nextSibling!.firstChild!,
      { target: { value: "A Description" } }
    );
    expect(
      screen.getByText('git commit -m "test: A Message')
    ).toBeInTheDocument();
    expect(screen.getAllByText("A Description")).toHaveLength(2);
    expect(screen.getByText('[KEN-1234 #finish]"')).toBeInTheDocument();
    // Remove commit description
    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(
      screen.getByText('git commit -m "test: A Message [KEN-1234 #finish]"')
    ).toBeInTheDocument();
    // Remove commit message
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(
      screen.getByText('git commit -m "test: [KEN-1234 #finish]"')
    ).toBeInTheDocument();
  });
});
