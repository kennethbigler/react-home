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

# Each fetch keeps its existing data on failure, so run both and only stop
# if one failed with nothing cached to fall back on
if [ "${SKIP_FETCH}" != "1" ]; then
  FETCH_FAILED=""
  echo "Fetching latest BotC community scripts..."
  node scripts/fetch-botc-scripts.mjs || FETCH_FAILED="$FETCH_FAILED fetch-botc-scripts"
  echo "Fetching latest Pokémon type charts..."
  node scripts/fetch-pokemon-types.mjs || FETCH_FAILED="$FETCH_FAILED fetch-pokemon-types"
  [ -z "$FETCH_FAILED" ] || throwError "$FETCH_FAILED"
else
  echo "Skipping BotC and Pokémon data fetch"
fi
echo $LINE
buildApp false
echo $LINE
deployCode
echo $LINE
gitSetup
