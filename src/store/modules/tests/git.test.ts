import { DBGit } from "../../types";
import gitReducer, {
  setKey,
  setBranchMessage,
  setBranchPrefix,
  setCasePreference,
  setCommitPrefix,
} from "../git";

const state: DBGit = {
  storyID: "storyID",
  branchMessage: "branchMessage",
  branchPrefix: "epics",
  casePreference: "kebab-case",
  commitPrefix: false,
};

describe("store | modules | git", () => {
  test("reducer with default action params", () => {
    expect(gitReducer(state, setKey())).toEqual({
      ...state,
      storyID: "",
    });
    expect(gitReducer(state, setBranchMessage())).toEqual({
      ...state,
      branchMessage: "",
    });
    expect(gitReducer(state, setBranchPrefix())).toEqual({
      ...state,
      branchPrefix: "features",
    });
    expect(gitReducer(state, setCasePreference())).toEqual({
      ...state,
      casePreference: "No Changes",
    });
    expect(gitReducer(state, setCommitPrefix())).toEqual({
      ...state,
      commitPrefix: true,
    });
  });

  test("incorrect parameters", () => {
    // @ts-expect-error: fake action for testing purposes
    expect(gitReducer(state, { type: undefined })).toEqual(state);
    // @ts-expect-error: fake action for testing purposes
    expect(gitReducer(undefined, { type: undefined })).toEqual({
      storyID: "",
      branchMessage: "",
      branchPrefix: "features",
      casePreference: "snake_case",
      commitPrefix: true,
    });
  });
});
