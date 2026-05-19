#!/bin/bash
LINE="--------------------------------------------------"

function throwError() {
  echo $LINE
  echo "Step Failed: $1"
  echo $LINE
  exit 1
}
