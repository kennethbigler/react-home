#!/bin/bash
source ./scripts/common.sh

function deployCode() {
  echo "Building react-home"
  rm -rf ./docs/static &&
  mv ./build/* ./docs &&
  rm -rf ./build || throwError "deploy code"
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

buildApp
echo $LINE
deployCode
echo $LINE
gitSetup
