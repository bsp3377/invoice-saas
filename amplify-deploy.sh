#!/bin/bash

export PATH=$PATH:~/.local/bin

echo "🚀 Deploying Invoice SaaS with AWS Amplify..."

# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify project
cd frontend
npx amplify init --yes

# Add authentication
npx amplify add auth

# Add API
npx amplify add api

# Add storage
npx amplify add storage

# Deploy backend
npx amplify push --yes

# Build and deploy frontend
npm run build
npx amplify publish --yes

echo "✅ Deployed successfully with AWS Amplify!"
echo "🌐 Your app is live at the Amplify hosting URL"