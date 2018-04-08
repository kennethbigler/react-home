#!/bin/bash
LINE="--------------------"
echo $LINE
echo "Running build scripts..."
echo $LINE
npm run build
echo $LINE
echo "Building react-home"
echo $LINE
rm -rf ./docs/static
mv build/* ./docs
rm -rf build
echo $LINE
echo "Success"
echo $LINE
# git status
# git add .
# git status
# git commit
# echo -e "\n--------------------\nComplete\n--------------------\nFinish with a:\ngit push\n"
