# Dockerfile for Blockchain Smart Contracts
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Install Python and build tools for native dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/blockchain-smart-contracts/package.json ./apps/blockchain-smart-contracts/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development

# Copy source code
COPY . .

# Compile contracts
RUN pnpm build:contracts

# Expose Hardhat node port
EXPOSE 8545

# Start Hardhat node
CMD ["pnpm", "dev:contracts"]

# Test stage
FROM base AS test

# Copy source code
COPY . .

# Run contract tests
CMD ["pnpm", "test:contracts"]

# Deploy stage
FROM base AS deploy

# Copy source code
COPY . .

# Compile contracts
RUN pnpm build:contracts

# Deploy contracts
CMD ["pnpm", "deploy:contracts"]

# Solana build stage
FROM node:18-alpine AS solana-base

# Install Rust and Solana CLI
RUN apk add --no-cache curl build-base
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor CLI
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
RUN avm install latest
RUN avm use latest

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy Solana program files
COPY apps/blockchain-smart-contracts/solana ./

# Build Solana program
RUN anchor build

# Test Solana program
FROM solana-base AS solana-test
CMD ["anchor", "test"]

# Deploy Solana program
FROM solana-base AS solana-deploy
CMD ["anchor", "deploy"]