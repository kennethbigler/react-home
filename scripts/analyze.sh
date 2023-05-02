#!/bin/bash
source ./scripts/common.sh

echo "Analyze the bundle size of non-deployed code"
echo $LINE
buildApp
echo $LINE
echo "Running source-map-explorer..."
echo $LINE
npx source-map-explorer "dist/assets/*.js" || throwError "source-map"
echo $LINE
echo "Cleaning up files..."
rm -rf dist || throwError "cleanup"
echo $LINE
echo "Complete! Check your browser."
