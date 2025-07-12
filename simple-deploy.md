# 🚀 Simple Deployment Guide

Your AWS user needs additional permissions. Here are 3 deployment options:

## Option 1: Add Required Permissions
Add these policies to your AWS user:
- `CloudFormationFullAccess`
- `IAMFullAccess` 
- `AWSLambda_FullAccess`
- `AmazonDynamoDBFullAccess`
- `AmazonCognitoPowerUser`
- `AmazonS3FullAccess`
- `AmazonAPIGatewayAdministrator`

## Option 2: Use AWS Console (Manual)
1. **Create DynamoDB Tables**:
   - `invoices` (user_id, invoice_id)
   - `users` (user_id)

2. **Create Cognito User Pool**:
   - Email verification
   - Password policy: 8+ chars

3. **Create Lambda Functions**:
   - Upload `backend/src/auth/index.js`
   - Upload `backend/src/invoices/index.js`

4. **Create API Gateway**:
   - Connect to Lambda functions
   - Enable CORS

## Option 3: Frontend-Only Deployment
Deploy just the React frontend to test the UI:

```bash
cd frontend
npm run build
# Upload build/ folder to any static hosting
```

## 🎯 Recommended: Request Admin Access
Ask your AWS administrator to:
1. Grant CloudFormation permissions
2. Run: `./deploy.sh` 
3. Your app will be live in 5 minutes!

## 📱 Test Locally
```bash
cd frontend
npm start
# Visit http://localhost:3000
```

Your invoice SaaS application is ready - just needs proper AWS permissions to deploy!