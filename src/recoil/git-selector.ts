import { selector } from "recoil";
import gitAtom, { storyIdGitAtom } from "./git-atom";

/** function to generate the branch name from inputs
 * @return {string} format prefix/<story_id>_name_lower_cased */
const branchNameGitSelector = selector({
  key: "branchNameGitSelector",
  get: ({ get }) => {
    const { branchMessage, branchPrefix } = get(gitAtom);
    const storyID = get(storyIdGitAtom);

    const prefix = branchPrefix ? `${branchPrefix}/` : "";
    return `${prefix}${storyID}${branchMessage}`;
  },
});

export default branchNameGitSelector;
