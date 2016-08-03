#!/bin/sh
set -e

source ~/.nvm/nvm.sh
nvm install 5.9
nvm use 5.9

npm version "$GO_PIPELINE_LABEL"
npm install -g npm-cli-login
npm-cli-login
npm publish .
