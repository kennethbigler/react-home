import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const branchPrefixes = ["chores", "epics", "features", "fixes"] as const;
export type BranchPrefixes = typeof branchPrefixes[number];
export const casePreferences = [
  "snake_case",
  "kebab-case",
  "camelCase",
  "No Changes",
] as const;
export type CasePreferences = typeof casePreferences[number];

export interface GitState {
  storyID: string;
  branchMessage: string;
  branchPrefix: BranchPrefixes;
  casePreference: CasePreferences;
  commitPrefix: boolean;
}

const initialState: GitState = {
  storyID: "",
  branchMessage: "",
  branchPrefix: "features",
  casePreference: "snake_case",
  commitPrefix: true,
};

export const gitSlice = createSlice({
  name: "git",
  initialState,
  reducers: {
    setKey: (state, action: PayloadAction<string>) => {
      state.storyID = action.payload;
    },
    setBranchMessage: (state, action: PayloadAction<string>) => {
      state.branchMessage = action.payload;
    },
    setBranchPrefix: (state, action: PayloadAction<BranchPrefixes>) => {
      state.branchPrefix = action.payload;
    },
    setCasePreference: (state, action: PayloadAction<CasePreferences>) => {
      state.casePreference = action.payload;
    },
    setCommitPrefix: (state, action: PayloadAction<boolean>) => {
      state.commitPrefix = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setKey,
  setBranchMessage,
  setBranchPrefix,
  setCasePreference,
  setCommitPrefix,
} = gitSlice.actions;

export default gitSlice.reducer;
