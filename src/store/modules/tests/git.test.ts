import gitReducer, {
  setKey,
  setBranchMessage,
  setBranchPrefix,
  setCasePreference,
  setCommitPrefix,
  GitState,
} from "../git";

const state: GitState = {
  storyID: "storyID",
  branchMessage: "branchMessage",
  branchPrefix: "epics",
  casePreference: "kebab-case",
  commitPrefix: false,
};

describe("store | modules | git", () => {
  test("reducer with default action params", () => {
    expect(gitReducer(state, setKey(""))).toEqual({
      ...state,
      storyID: "",
    });
    expect(gitReducer(state, setBranchMessage(""))).toEqual({
      ...state,
      branchMessage: "",
    });
    expect(gitReducer(state, setBranchPrefix("features"))).toEqual({
      ...state,
      branchPrefix: "features",
    });
    expect(gitReducer(state, setCasePreference("No Changes"))).toEqual({
      ...state,
      casePreference: "No Changes",
    });
    expect(gitReducer(state, setCommitPrefix(true))).toEqual({
      ...state,
      commitPrefix: true,
    });
  });

  test("incorrect parameters", () => {
    expect(gitReducer(state, { type: undefined })).toEqual(state);
    expect(gitReducer(undefined, { type: undefined })).toEqual({
      storyID: "",
      branchMessage: "",
      branchPrefix: "features",
      casePreference: "snake_case",
      commitPrefix: true,
    });
  });
});
