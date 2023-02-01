import * as React from "react";
import { deepOrange } from "@mui/material/colors";
import { useRecoilState } from "recoil";
import { storyIdGitAtom } from "../../../recoil/git-atom";
import BranchName from "./BranchName";
import CommitText from "./CommitText";
import DeployBranch from "./DeployBranch";
import Header from "./Header";
import ExpandableCard from "../../common/expandable-card";

import { getSelectOptions, validTypingId } from "./helpers";

const handleCopy = (text: string) => navigator.clipboard.writeText(text);

const gitTheme = deepOrange[900];

/* GitTools  ->  Header
 *          |->  BranchName    -|
 *          |->  CommitText    -|->  CopyTextDisplay
 *          |->  DeployBranch  -|    */
const GitTools: React.FC = () => {
  const [storyID, setStoryId] = useRecoilState(storyIdGitAtom);

  /** function to update text state based on value */
  const handleIDChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const [value] = validTypingId.exec(e.target.value) || [""];
    setStoryId(value);
  };

  return (
    <>
      <Header
        gitTheme={gitTheme}
        onIdChange={handleIDChange}
        storyID={storyID}
      />
      <ExpandableCard backgroundColor={gitTheme} title="Create Branch Name">
        <BranchName
          getSelectOptions={getSelectOptions}
          gitTheme={gitTheme}
          handleCopy={handleCopy}
        />
      </ExpandableCard>
      <ExpandableCard backgroundColor={gitTheme} title="Create Commit Message">
        <CommitText
          getSelectOptions={getSelectOptions}
          gitTheme={gitTheme}
          handleCopy={handleCopy}
          storyID={storyID}
        />
      </ExpandableCard>
      <ExpandableCard
        backgroundColor={gitTheme}
        title="Deploy to Test Pipelines"
      >
        <DeployBranch
          getSelectOptions={getSelectOptions}
          gitTheme={gitTheme}
          handleCopy={handleCopy}
        />
      </ExpandableCard>
    </>
  );
};

export default GitTools;
