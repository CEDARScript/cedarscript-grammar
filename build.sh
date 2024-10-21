#!/usr/bin/env bash

LIBRARY_NAME="${LIBRARY_NAME:-tree-sitter-cedarscript}"
TARGET_DIR="target"
GRAMMAR_DIR="src/cedarscript_grammar"

ts() ( cd "$TARGET_DIR" && tree-sitter-macos-arm64 "$@" ;)

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

mkdir -p "$TARGET_DIR"
cp grammar.js "$TARGET_DIR"/

ts generate -l -b && \
ts build --wasm && \
cp -a test "$TARGET_DIR" && \
ts test || { playground; exit 1 ;}

# MacOS compilation
rm -f "$TARGET_DIR"/lib"$LIBRARY_NAME".* "$GRAMMAR_DIR"/lib"$LIBRARY_NAME".* && \
(cd "$TARGET_DIR" && cc -c -I./src src/parser.c && cc -dynamiclib -o lib"$LIBRARY_NAME".dylib parser.o) && \
mv "$TARGET_DIR"/lib"$LIBRARY_NAME".dylib "$GRAMMAR_DIR"/ \
  || exit

# Linux and Windows compilation using Docker
BUILDKIT_PROGRESS=plain docker build -t "$LIBRARY_NAME"-builder --build-arg LIBRARY_NAME="$LIBRARY_NAME" . || exit
container_id=$(docker create "$LIBRARY_NAME"-builder) || exit
# Copy both Linux and Windows libraries from the single container
docker cp "$container_id:/out/lib/lib${LIBRARY_NAME}.so" "$GRAMMAR_DIR/" && \
docker cp "$container_id:/out/lib/lib${LIBRARY_NAME}.dll" "$GRAMMAR_DIR/" && \
docker rm "$container_id" > /dev/null || exit

ls -Falk "$GRAMMAR_DIR"/*.{so,dylib,dll}
du -hs "$GRAMMAR_DIR"/*.{so,dylib,dll}

playground
