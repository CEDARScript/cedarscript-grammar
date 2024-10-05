FROM debian:12-slim

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    build-essential git curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install tree-sitter-cli
RUN npm install -g tree-sitter-cli

# Set up working directory
WORKDIR /tree-sitter-cedar

# Copy only the required files
COPY grammar.js .

# Generate and build the parser
RUN tree-sitter generate -l -b && \
    cc -c -I./src src/parser.c && \
    cc -shared -o /libtree-sitter-cedar.so parser.o && \
    apt-get purge -y --auto-remove build-essential git curl \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
