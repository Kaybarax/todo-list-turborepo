#!/bin/bash

# Wrapper script for anchor build using rustup run

echo "Setting up Solana toolchain..."

# Recreate the solana toolchain link
rustup toolchain link solana /Users/kevin/.local/share/solana/install/releases/stable-23e01995a3d547295dd8dfa83fafe93f07de78d9/solana-release/bin/platform-tools-sdk/sbf/dependencies/platform-tools/rust

echo "Building Solana program with anchor using rustup run..."

# Use rustup run instead of +toolchain syntax
CARGO_BUILD_SBF_COMMAND="rustup run solana cargo-build-sbf" anchor build

echo "Build completed!"