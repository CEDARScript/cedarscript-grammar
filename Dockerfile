FROM debian:12-slim

ARG LIBRARY_NAME=tree-sitter-cedarscript

# Install necessary dependencies
RUN apt-get update && apt-get >/dev/null install -y \
    build-essential git curl mingw-w64 gcc-x86-64-linux-gnu \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get >/dev/null install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install tree-sitter-cli
RUN npm >/dev/null install -g tree-sitter-cli

# Set up working directory
WORKDIR /out

# Copy only the required files
COPY grammar.js .

# Generate and build the parser
RUN tree-sitter generate -l -b && mkdir lib && \
    # AMD64 Linux build
    x86_64-linux-gnu-gcc -c -I./src src/parser.c -o parser_amd64.o && \
    x86_64-linux-gnu-gcc -shared -o lib/lib$LIBRARY_NAME.amd64.so parser_amd64.o && \
    # ARM64 Linux build
    gcc -c -I./src src/parser.c -o parser_arm64.o && \
    gcc -shared -o lib/lib$LIBRARY_NAME.arm64.so parser_arm64.o && \
    # Windows build
    x86_64-w64-mingw32-gcc -c -I./src src/parser.c && \
    x86_64-w64-mingw32-gcc -shared -o lib/lib$LIBRARY_NAME.dll parser.o && \
    apt-get >/dev/null purge 2>&1 -y --auto-remove build-essential git curl \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
