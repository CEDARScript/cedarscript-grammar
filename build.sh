#!/usr/bin/env bash

LIBRARY_NAME="${LIBRARY_NAME:-tree-sitter-cedarscript}"
TARGET_DIR="target"
GRAMMAR_DIR="src/cedarscript_grammar"

 ts() (
     cd "$TARGET_DIR" || exit
     command -v tree-sitter &> /dev/null && {
       set -x
       tree-sitter "$@"
       return
     }
     if test "$GITHUB_ACTIONS" || uname | grep -Eq '^(MSYS|Linux)'; then
         # On GitHub Actions or Linux, install and use tree-sitter from npm
         npm install --global tree-sitter-cli
     fi
     tree-sitter "$@"
 )

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

rm -f "$TARGET_DIR"/lib"$LIBRARY_NAME".* "$GRAMMAR_DIR"/lib"$LIBRARY_NAME".*

# Linux and Windows compilation using Docker
BUILDKIT_PROGRESS=plain docker buildx build \
-t "$LIBRARY_NAME"-builder --build-arg LIBRARY_NAME="$LIBRARY_NAME" --load . || exit
container_id=$(docker create "$LIBRARY_NAME"-builder) || exit
# Copy both Linux and Windows libraries from the single container
docker cp "$container_id:/out/lib/lib${LIBRARY_NAME}.amd64.so" "$GRAMMAR_DIR/" && \
docker cp "$container_id:/out/lib/lib${LIBRARY_NAME}.arm64.so" "$GRAMMAR_DIR/" && \
docker cp "$container_id:/out/lib/lib${LIBRARY_NAME}.dll" "$GRAMMAR_DIR/" && \
docker rm "$container_id" > /dev/null || exit

# MacOS compilation
if test "$(uname)" = Darwin; then
  echo "MacOS compilation..."
  (cd "$TARGET_DIR" && cc -c -I./src src/parser.c && cc -dynamiclib -o lib"$LIBRARY_NAME".dylib parser.o) && \
  mv "$TARGET_DIR"/lib"$LIBRARY_NAME".dylib "$GRAMMAR_DIR"/ \
    || exit
fi

ls -Falk "$GRAMMAR_DIR"/*.{so,dylib,dll}
du -hs "$GRAMMAR_DIR"/*.{so,dylib,dll}

playground
