#!/bin/bash
LINE="--------------------"
echo "Analyze the bundle size of non-deployed code"
echo $LINE
echo "Running build scripts..."
echo $LINE
npm run build
echo $LINE
echo "Running source-map-explorer..."
echo $LINE
npx source-map-explorer 'build/static/js/*.js'
echo $LINE
echo "Cleaning up files..."
rm -rf build
echo $LINE
echo "Complete! Check your browser."
