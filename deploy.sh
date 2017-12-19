#!/bin/bash
echo "Running build/deploy scripts..."
npm run build
echo -e "\n--------------------\nBuilding react-home \n--------------------"
rm -rf ./static
mv build/* ./
echo -e "Success \n--------------------\n"
git status
git add .
git status
git commit
echo -e "\n--------------------\nComplete\n--------------------\nFinish with a:\ngit push\n"
