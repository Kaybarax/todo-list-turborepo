#!/bin/bash

# Wrapper script to build Solana programs

echo "Setting up Solana build environment..."

# Create the solana toolchain link
rustup toolchain link solana /Users/kevin/.local/share/solana/install/active_release/bin/platform-tools-sdk/sbf/dependencies/platform-tools/rust

# Set environment variables
export PATH="/Users/kevin/.local/share/solana/install/active_release/bin/platform-tools-sdk/sbf/dependencies/platform-tools/rust/bin:$PATH"
export RUSTC="/Users/kevin/.local/share/solana/install/active_release/bin/platform-tools-sdk/sbf/dependencies/platform-tools/rust/bin/rustc"
export CARGO="/Users/kevin/.local/share/solana/install/active_release/bin/platform-tools-sdk/sbf/dependencies/platform-tools/rust/bin/cargo"

echo "Building with anchor..."
anchor build

echo "Build completed!"