import { atom } from "recoil";

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
  branchMessage: string;
  branchPrefix: BranchPrefixes;
  casePreference: CasePreferences;
}

const initialState: GitState = {
  branchMessage: "",
  branchPrefix: "features",
  casePreference: "snake_case",
};

const gitAtom = atom({
  key: "gitAtom",
  default:
    (JSON.parse(localStorage.getItem("git-atom") || "null") as GitState) ||
    initialState,
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("git-atom", JSON.stringify(state));
      });
    },
  ],
});

export const storyIdGitAtom = atom({
  key: "storyIdGitAtom",
  default: JSON.parse(
    localStorage.getItem("story-id-git-atom") || '""'
  ) as string,
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("story-id-git-atom", JSON.stringify(state));
      });
    },
  ],
});

export const commitPrefixGitAtom = atom({
  key: "commitPrefixGitAtom",
  default: JSON.parse(
    localStorage.getItem("commit-prefix-git-atom") || "true"
  ) as boolean,
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("commit-prefix-git-atom", JSON.stringify(state));
      });
    },
  ],
});

export default gitAtom;
