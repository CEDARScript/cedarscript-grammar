#!/usr/bin/env bash

ts() { tree-sitter-macos-arm64 "$@" ;}

playground() {
  while true; do
      read -p "Do you want to go to the playground? (Y/n): " answer
      test "$answer" || answer=y
      case $answer in
          [Yy]* ) echo "Launching CEDARScript playground..."; break;;
          [Nn]* ) echo "Exiting..."; return;;
          * ) echo "Please answer yes or no.";;
      esac
  done

  ts playground
}

ts generate -l -b && \
ts build --wasm && \
ts test || { playground; exit 1 ;}

mkdir -p ../vendor && \
rm -f libtree-sitter-cedar.* ../vendor/libtree-sitter-cedar.* && \
cc -c -I./src src/parser.c && cc -dynamiclib -o libtree-sitter-cedar.dylib parser.o && \
mv libtree-sitter-cedar.dylib ../vendor/libtree-sitter-cedar.dylib && \
docker build -t tree-sitter-cedar-builder . && \
docker cp $(docker create tree-sitter-cedar-builder):/libtree-sitter-cedar.so \
  ../vendor/libtree-sitter-cedar.so || exit

git add ../vendor/*

playground
