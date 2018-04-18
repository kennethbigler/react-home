#!/bin/bash
LINE="--------------------"
echo "Running build scripts..."
echo $LINE
npm run build
echo $LINE
echo "Building react-home"
rm -rf ./docs/static
mv build/* ./docs
rm -rf build
rmdir build
echo $LINE
echo "Success"
echo $LINE
git status
git add .
git status
git commit
echo $LINE
echo "Complete"
echo $LINE
echo -e "Finish with a:\ngit push\n"
