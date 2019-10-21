import React from 'react';

interface UseCommitTextReturns {
  commitPrefix: string;
  commitMessage: string;
  commitDescription: string;
  finishes: boolean;
  getCommitText: Function;
  handleCommitPrefixSelect: React.ChangeEventHandler;
  handleCommitMessageChange: React.ChangeEventHandler;
  handleCommitDescriptionChange: React.ChangeEventHandler;
  clearCommitMessage: React.MouseEventHandler;
  clearCommitDescription: React.MouseEventHandler;
  handleFinishesToggle: Function;
}

function useCommitText(storyID?: string, gitCommit?: boolean): UseCommitTextReturns {
  const [commitPrefix, setLocalCommitPrefix] = React.useState('feat');
  const [commitMessage, setCommitMessage] = React.useState('');
  const [commitDescription, setCommitDescription] = React.useState('');
  const [finishes, setFinishes] = React.useState(false);

  /** function to generate the commit message from inputs
   * @return {string} format Prefix: Message [?Finishes? ID] */
  const getCommitText = (): string => {
    // prefix
    const prefix = commitPrefix ? `${commitPrefix}: ` : '';

    // description
    let desc = ' ';
    if (commitDescription && storyID) {
      desc = `\n\n${commitDescription}\n\n`;
    } else if (commitDescription) {
      desc = `\n\n${commitDescription}`;
    }

    // postfix
    let postfix = '';
    if (finishes && storyID) {
      postfix = `[${storyID} #finish]`;
    } else if (storyID) {
      postfix = `[${storyID}]`;
    }

    // compile all components together
    const gitMessage = `${prefix}${commitMessage}${desc}${postfix}`;

    // add syntax wrapper
    return gitCommit ? `git commit -m "${gitMessage}"` : gitMessage;
  };

  /** function to update select state based on value */
  const handleCommitPrefixSelect = (e: any): void => {
    setLocalCommitPrefix(e.target.value);
  };

  /** function to update text state based on value */
  const handleCommitMessageChange = (e: any): void => {
    setCommitMessage(e.target.value);
  };

  const handleCommitDescriptionChange = (e: any): void => {
    setCommitDescription(e.target.value);
  };

  /** function to update text state based on value */
  const clearCommitMessage = (): void => {
    setCommitMessage('');
  };

  const clearCommitDescription = (): void => {
    setCommitDescription('');
  };

  const handleFinishesToggle = (_e: any, isC: boolean): void => {
    setFinishes(isC);
  };

  return {
    commitPrefix,
    commitMessage,
    commitDescription,
    finishes,
    getCommitText,
    handleCommitPrefixSelect,
    handleCommitMessageChange,
    handleCommitDescriptionChange,
    clearCommitMessage,
    clearCommitDescription,
    handleFinishesToggle,
  };
}

export default useCommitText;
