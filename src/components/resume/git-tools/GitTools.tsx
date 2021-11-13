import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import { deepOrange } from "@mui/material/colors";
import handleCopy from "copy-to-clipboard";
import snakeCase from "lodash/snakeCase";
import kebabCase from "lodash/kebabCase";
import camelCase from "lodash/camelCase";
import {
  setBranchMessage,
  setBranchPrefix,
  setCasePreference,
  setKey,
} from "../../../store/modules/git";
import BranchName from "./BranchName";
import CommitText from "./CommitText";
import DeployBranch from "./DeployBranch";
import Header from "./Header";
import ExpandableCard from "../../common/expandable-card";
import {
  DBRootState,
  BranchPrefixes,
  CasePreferences,
} from "../../../store/types";

const gitTheme = deepOrange[600];
export const validTypingId = RegExp("[A-Z]{1,4}-?[a-zA-Z0-9]*");

/** function to generate select items based of input */
export const getSelectOptions = (arr: string[]): React.ReactNode =>
  arr.map((t, i) => (
    <MenuItem key={i} value={t}>
      {t}
    </MenuItem>
  ));

/** function to generate the branch name from inputs
 * @return {string} format prefix/<story_id>_name_lower_cased */
export const getBranchName = (
  branchMessage: string,
  branchPrefix: BranchPrefixes,
  casePreference: CasePreferences,
  storyID: string
): string => {
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
};

/* GitTools  ->  Header
 *          |->  BranchName    -|
 *          |->  CommitText    -|->  CopyTextDisplay
 *          |->  DeployBranch  -|    */
const GitTools: React.FC = () => {
  const { branchMessage, branchPrefix, casePreference, storyID } = useSelector(
    (state: DBRootState) => state.git
  );
  const dispatch = useDispatch();

  /** function to update text state based on value */
  const handleIDChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback(
    (e) => {
      const [value] = validTypingId.exec(e.target.value) || [""];
      dispatch(setKey(value));
    },
    [dispatch]
  );
  /** function to update text state based on value */
  const handleBranchMessageChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback(
    (e) => {
      dispatch(setBranchMessage(e.target.value));
    },
    [dispatch]
  );
  /** function to clear text state based on value */
  const handleBranchMessageClear = React.useCallback((): void => {
    dispatch(setBranchMessage(""));
  }, [dispatch]);
  /** function to update text state based on value */
  const handleBranchPrefix = React.useCallback(
    (newBranchPrefix: BranchPrefixes): void => {
      dispatch(setBranchPrefix(newBranchPrefix));
    },
    [dispatch]
  );
  /** function to update case pref based on value */
  const handleCasePreference = React.useCallback(
    (newCasePreference: CasePreferences): void => {
      dispatch(setCasePreference(newCasePreference));
    },
    [dispatch]
  );

  const branchName = getBranchName(
    branchMessage,
    branchPrefix,
    casePreference,
    storyID
  );

  return (
    <>
      <Header
        {...{
          gitTheme,
          onIdChange: handleIDChange,
          storyID,
        }}
      />
      <ExpandableCard backgroundColor={gitTheme} title="Create Branch Name">
        <BranchName
          {...{
            branchMessage,
            branchName,
            branchPrefix,
            casePreference,
            getSelectOptions,
            gitTheme,
            handleCopy,
            onBranchMessageChange: handleBranchMessageChange,
            onBranchMessageClear: handleBranchMessageClear,
            setBranchPrefix: handleBranchPrefix,
            setCasePreference: handleCasePreference,
          }}
        />
      </ExpandableCard>
      <ExpandableCard backgroundColor={gitTheme} title="Create Commit Message">
        <CommitText
          {...{
            getSelectOptions,
            gitTheme,
            handleCopy,
            storyID,
          }}
        />
      </ExpandableCard>
      <ExpandableCard
        backgroundColor={gitTheme}
        title="Deploy to Test Pipelines"
      >
        <DeployBranch
          {...{
            branchName,
            getSelectOptions,
            gitTheme,
            handleCopy,
          }}
        />
      </ExpandableCard>
    </>
  );
};

export default GitTools;
