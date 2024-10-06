#!/usr/bin/env bash

ts() ( cd target && tree-sitter-macos-arm64 "$@" ;)

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

mkdir -p target
cp grammar.js target/

ts generate -l -b && \
ts build --wasm && \
cp -a test target && \
ts test || { playground; exit 1 ;}

mkdir -p vendor && \
rm -f target/libtree-sitter-cedar.* vendor/libtree-sitter-cedar.* && \
(cd target && cc -c -I./src src/parser.c && cc -dynamiclib -o libtree-sitter-cedar.dylib parser.o) && \
mv target/libtree-sitter-cedar.dylib vendor/ && \
docker build -t tree-sitter-cedar-builder . && \
docker cp $(docker create tree-sitter-cedar-builder):/libtree-sitter-cedar.so \
  vendor/libtree-sitter-cedar.so || exit

playground
