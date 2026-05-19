#!/bin/bash
LINE="--------------------------------------------------"

function throwError() {
  echo $LINE
  echo "Step Failed: $1"
  echo $LINE
  exit 1
}

function buildApp() {
  local sourcemaps="${1:-true}"
  echo "Running build scripts..."
  echo $LINE
  SOURCEMAPS="$sourcemaps" npm run build || throwError "build"
}
