#!/bin/bash
source ./scripts/common.sh

function deployCode() {
  echo "Building react-home"
  rm -rf ./docs/assets &&
  mv ./dist/* ./docs &&
  rm -rf ./dist || throwError "deploy code"
  echo $LINE
  echo "Success"
}

function gitSetup() {
  git status &&
  git add . &&
  git status &&
  git commit || throwError "git"
  echo $LINE
  echo "Complete"
  echo $LINE
  echo -e "Finish with a:\ngit push\n"
}

if [ "${SKIP_BOTC_FETCH}" != "1" ]; then
  echo "Fetching latest BotC community scripts..."
  node scripts/fetch-botc-scripts.mjs || throwError "fetch-botc-scripts"
else
  echo "Skipping BotC community scripts fetch"
fi
echo $LINE
buildApp false
echo $LINE
deployCode
echo $LINE
gitSetup
