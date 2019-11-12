#!/bin/bash
LINE="--------------------------------------------------"

function throwError() {
  echo $LINE
  echo "Step Failed: $1"
  set -e
}

function buildApp() {
  echo "Running build scripts..."
  echo $LINE
  npm run build || throwError "build"
}
