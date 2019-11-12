#!/bin/bash
source ./scripts/common.sh

buildApp
echo $LINE
echo "Building react-home"
rm -rf ./docs/static &&
mv build/* ./docs &&
rm -rf build &&
rmdir build || throwError "deploy code"
echo $LINE
echo "Success"
echo $LINE
git status &&
git add . &&
git status &&
git commit || throwError "git"
echo $LINE
echo "Complete"
echo $LINE
echo -e "Finish with a:\ngit push\n"
