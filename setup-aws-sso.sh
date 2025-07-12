#!/bin/bash

export PATH=$PATH:~/.local/bin

echo "🔐 AWS SSO Setup (Recommended)"
echo "=============================="
echo ""
echo "This is the most secure method - no long-term credentials!"
echo ""

# Configure AWS SSO
aws configure sso

echo ""
echo "✅ AWS SSO configured!"
echo ""
echo "🧪 Testing connection..."
if aws sts get-caller-identity > /dev/null 2>&1; then
    echo "✅ AWS connection successful!"
    echo ""
    echo "🚀 Ready to deploy! Run: ./deploy.sh"
else
    echo "❌ Connection failed. Try: aws sso login"
fi