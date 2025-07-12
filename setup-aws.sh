#!/bin/bash

echo "🔧 AWS Configuration Setup"
echo "=========================="
echo ""
echo "You need AWS credentials to deploy. Get them from:"
echo "1. AWS Console → IAM → Users → Your User → Security Credentials"
echo "2. Or create a new IAM user with programmatic access"
echo ""
echo "Required permissions:"
echo "- CloudFormation (full access)"
echo "- Lambda (full access)"
echo "- API Gateway (full access)"
echo "- DynamoDB (full access)"
echo "- Cognito (full access)"
echo "- S3 (full access)"
echo "- IAM (limited access for role creation)"
echo ""
echo "Enter your AWS credentials:"
echo ""

# Add PATH
export PATH=$PATH:~/.local/bin

# Configure AWS
aws configure

echo ""
echo "✅ AWS CLI configured!"
echo ""
echo "🧪 Testing AWS connection..."
if aws sts get-caller-identity > /dev/null 2>&1; then
    echo "✅ AWS connection successful!"
    echo ""
    echo "🚀 Ready to deploy! Run: ./deploy.sh"
else
    echo "❌ AWS connection failed. Please check your credentials."
fi