#!/bin/bash
echo "Running build/deploy scripts"
npm run build
echo -e "\n--------------------\n Building react-home \n--------------------"
rm index.html
cp -r build/index.html ./
rm -rf ./static
mv build/* ./
echo -e "Success \n--------------------\n"
git status
git add .
git status
git commit
