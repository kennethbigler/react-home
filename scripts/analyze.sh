#!/bin/bash
source ./scripts/common.sh

echo "npm i"
npm i
echo "Analyze the bundle size of non-deployed code"
echo $LINE
buildApp
echo $LINE
echo "Running source-map-explorer..."
echo $LINE
npx source-map-explorer "dist/assets/*.js" --no-border-checks || throwError "source-map"
echo $LINE
echo "Cleaning up files..."
rm -rf dist || throwError "cleanup"
echo $LINE
echo "Complete! Check your browser."
