FROM debian:12-slim

ARG LIBRARY_NAME=tree-sitter-cedarscript

# Install necessary dependencies
RUN apt-get update && apt-get >/dev/null install -y \
    build-essential git curl mingw-w64 \
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
    cc -c -I./src src/parser.c && \
    cc -shared -o lib/lib$LIBRARY_NAME.so parser.o && \
    x86_64-w64-mingw32-gcc -c -I./src src/parser.c && \
    x86_64-w64-mingw32-gcc -shared -o lib/lib$LIBRARY_NAME.dll parser.o && \
    apt-get >/dev/null purge 2>&1 -y --auto-remove build-essential git curl \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
