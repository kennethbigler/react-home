import { selector } from "recoil";
import snakeCase from "lodash/snakeCase";
import kebabCase from "lodash/kebabCase";
import camelCase from "lodash/camelCase";
import gitAtom, { storyIdGitAtom } from "./git-atom";

/** function to generate the branch name from inputs
 * @return {string} format prefix/<story_id>_name_lower_cased */
const branchNameGitSelector = selector({
  key: "branchNameGitSelector",
  get: ({ get }) => {
    const { branchMessage, branchPrefix, casePreference } = get(gitAtom);
    const storyID = get(storyIdGitAtom);

    const prefix = branchPrefix ? `${branchPrefix}/` : "";
    let msg = "";
    switch (casePreference) {
      case "snake_case":
        msg = `${storyID && `${storyID}_`}${snakeCase(branchMessage)}`;
        break;
      case "kebab-case":
        msg = `${storyID && `${storyID}-`}${kebabCase(branchMessage)}`;
        break;
      case "camelCase":
        msg = `${storyID}${camelCase(branchMessage)}`;
        break;
      default:
        msg = `${storyID}${branchMessage}`;
    }
    return `${prefix}${msg}`;
  },
});

export default branchNameGitSelector;
