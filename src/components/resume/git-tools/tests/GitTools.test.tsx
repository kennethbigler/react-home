import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import render from "../../../../recoil-test-render";
import GitTools from "../GitTools";
import { validTypingId, getSelectOptions } from "../helpers";

describe("resume | git-tools |  GitTools", () => {
  test("validTypingId", () => {
    const [value1] = validTypingId.exec("KEN-1234") || [""];
    expect(value1).toStrictEqual("KEN-1234");
    const [value2] = validTypingId.exec("1234") || [""];
    expect(value2).toStrictEqual("");
  });

  test("getSelectOptions", () => {
    const selectOptions = getSelectOptions(["feat", "test"]);
    // @ts-expect-error: we know this will be an array length 2
    expect(selectOptions.length).toStrictEqual(2);
  });

  it("renders as expected", () => {
    render(<GitTools />);

    // Git Tools
    expect(screen.getByText("Git Tools")).toBeInTheDocument();
    expect(screen.getAllByText("User Story ID")).toHaveLength(2);
    expect(screen.getAllByText("User Story ID")[0]).toHaveStyle(
      "color: rgb(244, 81, 30);"
    );

    // Create Branch Name
    expect(screen.getByText("Create Branch Name")).toBeInTheDocument();
    expect(screen.getByText("Branch Prefix")).toBeInTheDocument();
    expect(screen.getByText("features")).toBeInTheDocument();
    expect(screen.getByText("Case Preference")).toBeInTheDocument();
    expect(screen.getByText("snake_case")).toBeInTheDocument();
    expect(screen.getAllByText("Branch Name")).toHaveLength(2);
    expect(screen.getByText("features/")).toBeInTheDocument();

    // Create Commit Message
    expect(screen.getByText("Create Commit Message")).toBeInTheDocument();
    expect(screen.getByText("Commit Prefix")).toBeInTheDocument();
    expect(screen.getByText("feat")).toBeInTheDocument();
    expect(screen.getByText("Finishes User Story")).toBeInTheDocument();
    expect(screen.getByText("Add git commit -m")).toBeInTheDocument();
    expect(screen.getAllByText("Commit Message")).toHaveLength(2);
    expect(screen.getAllByText("Commit Description")).toHaveLength(2);
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();

    // Deploy to Test Pipelines
    expect(screen.getByText("Deploy to Test Pipelines")).toBeInTheDocument();
    expect(screen.getByText("Target Branch")).toBeInTheDocument();
    expect(screen.getByText("test-pipeline")).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin features/:test-pipeline")
    ).toBeInTheDocument();
  });

  it("handles id changes with a valid id", () => {
    render(<GitTools />);

    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("User Story ID")[0].nextSibling!.firstChild!,
      { target: { value: "KEN-1234" } }
    );
    expect(screen.getByDisplayValue("KEN-1234")).toBeInTheDocument();
    expect(screen.getByText("features/KEN-1234_")).toBeInTheDocument();
    expect(
      screen.getByText('git commit -m "feat: [KEN-1234]"')
    ).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin features/KEN-1234_:test-pipeline")
    ).toBeInTheDocument();
  });

  it("handles id changes with an invalid id", () => {
    render(<GitTools />);

    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("User Story ID")[0].nextSibling!.firstChild!,
      { target: { value: "1234" } }
    );
    expect(screen.queryByDisplayValue("1234")).toBeNull();
    expect(screen.getByText("features/")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin features/:test-pipeline")
    ).toBeInTheDocument();
  });

  it("handles BranchMessageChange when Branch Name is changed", () => {
    render(<GitTools />);

    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("Branch Name")[0].nextSibling!.firstChild!,
      { target: { value: "branchMessage" } }
    );
    expect(screen.getByDisplayValue("branchMessage")).toBeInTheDocument();
    expect(screen.getByText("features/branch_message")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText(
        "git push -f origin features/branch_message:test-pipeline"
      )
    ).toBeInTheDocument();
  });

  it("calls onBranchMessageClear when Branch Name clear button is pressed", () => {
    render(<GitTools />);

    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("Branch Name")[0].nextSibling!.firstChild!,
      { target: { value: "branchMessage" } }
    );
    expect(screen.getByDisplayValue("branchMessage")).toBeInTheDocument();
    expect(screen.getByText("features/branch_message")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText(
        "git push -f origin features/branch_message:test-pipeline"
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button")[2]);
    expect(screen.queryByDisplayValue("branchMessage")).toBeNull();
    expect(screen.getByText("features/")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin features/:test-pipeline")
    ).toBeInTheDocument();
  });

  it("calls setBranchPrefix on select of Branch Prefix option", () => {
    render(<GitTools />);

    expect(screen.getByText("features/")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin features/:test-pipeline")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue("features"), {
      target: { value: "fixes" },
    });
    expect(screen.getByText("fixes/")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin fixes/:test-pipeline")
    ).toBeInTheDocument();
  });

  it("calls setCasePreference on select of case option", () => {
    render(<GitTools />);

    expect(screen.getByText("features/")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin features/:test-pipeline")
    ).toBeInTheDocument();

    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("Branch Name")[0].nextSibling!.firstChild!,
      { target: { value: "branchMessage" } }
    );
    expect(screen.getByDisplayValue("branchMessage")).toBeInTheDocument();
    expect(screen.getByText("features/branch_message")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText(
        "git push -f origin features/branch_message:test-pipeline"
      )
    ).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue("snake_case"), {
      target: { value: "kebab-case" },
    });
    expect(screen.getByText("features/branch-message")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText(
        "git push -f origin features/branch-message:test-pipeline"
      )
    ).toBeInTheDocument();
  });

  it("adds multiple lines when a Commit Description is added", () => {
    render(<GitTools />);

    expect(screen.getByText("features")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat: "')).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin features/:test-pipeline")
    ).toBeInTheDocument();

    fireEvent.change(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      screen.getAllByText("Commit Description")[0].nextSibling!.firstChild!,
      { target: { value: "some desc" } }
    );
    expect(screen.getByText("features")).toBeInTheDocument();
    expect(screen.getByText('git commit -m "feat:')).toBeInTheDocument();
    expect(screen.getByText('some desc"')).toBeInTheDocument();
    expect(
      screen.getByText("git push -f origin features/:test-pipeline")
    ).toBeInTheDocument();
  });
});
