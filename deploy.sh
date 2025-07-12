#!/bin/bash

# Add PATH
export PATH=$PATH:~/.local/bin

echo "🚀 Deploying Invoice SaaS Application to AWS..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run './setup-aws.sh' first."
    exit 1
fi

# Deploy backend
echo "📦 Building and deploying backend..."
cd backend

# Build the SAM application
sam build

# Deploy with guided setup (first time) or use existing config
if [ ! -f samconfig.toml ]; then
    echo "🔧 First time deployment - running guided setup..."
    sam deploy --guided
else
    echo "🔄 Using existing configuration..."
    sam deploy
fi

# Get the outputs
echo "📋 Getting deployment outputs..."
STACK_NAME=$(grep stack_name samconfig.toml | cut -d'"' -f2)
API_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)
USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text)
USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' --output text)
REGION=$(aws configure get region)

echo "✅ Backend deployed successfully!"
echo "📝 Configuration details:"
echo "   API URL: $API_URL"
echo "   User Pool ID: $USER_POOL_ID"
echo "   Client ID: $USER_POOL_CLIENT_ID"
echo "   Region: $REGION"

# Update frontend configuration
echo "🔧 Updating frontend configuration..."
cd ../frontend/src

# Create a backup of the original index.js
cp index.js index.js.backup

# Update the configuration in index.js
cat > index.js << EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import App from './App';

// AWS Amplify configuration
const awsConfig = {
  Auth: {
    region: '$REGION',
    userPoolId: '$USER_POOL_ID',
    userPoolWebClientId: '$USER_POOL_CLIENT_ID',
  },
  API: {
    endpoints: [
      {
        name: 'invoiceApi',
        endpoint: '$API_URL',
        region: '$REGION'
      }
    ]
  }
};

Amplify.configure(awsConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
EOF

echo "✅ Frontend configuration updated!"

# Build frontend
echo "🏗️  Building frontend..."
cd ..
npm run build

echo "🎉 Deployment completed successfully!"
echo ""
echo "🌐 Your Invoice SaaS application is ready!"
echo "   Backend API: $API_URL"
echo "   Frontend build: ./frontend/build/"
echo ""
echo "📋 Next steps:"
echo "   1. Test locally: cd frontend && npm start"
echo "   2. Deploy frontend to S3 + CloudFront (optional)"
echo "   3. Configure custom domain (optional)"
echo ""
echo "🔐 Test your application:"
echo "   1. Sign up for a new account"
echo "   2. Create your first invoice"
echo "   3. View invoice history"