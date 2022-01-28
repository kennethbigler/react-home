#!/bin/bash
LINE="--------------------------------------------------"

function throwError() {
  echo $LINE
  echo "Step Failed: $1"
  echo $LINE
  exit 1
}

function buildApp() {
  echo "Running build scripts..."
  echo $LINE
  DISABLE_ESLINT_PLUGIN=true npm run build || throwError "build"
}
