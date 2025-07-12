# Invoice SaaS Application

A cloud-native invoice management SaaS application built with React frontend and AWS serverless backend.

## Features

- **User Authentication**: Secure signup/login with AWS Cognito
- **Invoice Creation**: Modern invoice editor with automatic calculations
- **Tax Calculations**: Automatic CGST/SGST calculations
- **Cloud Storage**: All data stored securely in AWS DynamoDB
- **Invoice History**: View, edit, and delete saved invoices
- **PDF Export**: Generate professional PDF invoices
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

- **Frontend**: React.js with AWS Amplify
- **Backend**: AWS Lambda functions with API Gateway
- **Database**: Amazon DynamoDB (NoSQL)
- **Authentication**: AWS Cognito User Pools
- **File Storage**: Amazon S3
- **Infrastructure**: AWS SAM (Serverless Application Model)

## Prerequisites

- Node.js 18+ installed
- AWS CLI configured with appropriate permissions
- AWS SAM CLI installed

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Deploy Backend to AWS

```bash
cd backend
sam build
sam deploy --guided
```

Follow the prompts to configure your deployment. Note the outputs (API URL, User Pool ID, etc.).

### 3. Configure Frontend

Update `frontend/src/index.js` with the values from your deployment:

```javascript
const awsConfig = {
  Auth: {
    region: 'your-region',
    userPoolId: 'your-user-pool-id',
    userPoolWebClientId: 'your-client-id',
  },
  API: {
    endpoints: [
      {
        name: 'invoiceApi',
        endpoint: 'your-api-endpoint',
        region: 'your-region'
      }
    ]
  }
};
```

### 4. Start Development Server

```bash
cd frontend
npm start
```

## Project Structure

```
invoice-leo/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication Lambda
│   │   └── invoices/       # Invoice management Lambda
│   ├── template.yaml       # SAM template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## Available Scripts

- `npm run setup` - Install all dependencies
- `npm run dev` - Start both frontend and backend locally
- `npm run build` - Build frontend for production
- `npm run deploy` - Deploy backend to AWS

## Environment Variables

Backend Lambda functions use these environment variables (automatically set by SAM):

- `INVOICES_TABLE` - DynamoDB table name for invoices
- `USERS_TABLE` - DynamoDB table name for users
- `COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `S3_BUCKET` - S3 bucket for file storage

## API Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /invoices` - Get user's invoices
- `POST /invoices` - Create new invoice
- `GET /invoices/{id}` - Get specific invoice
- `PUT /invoices/{id}` - Update invoice
- `DELETE /invoices/{id}` - Delete invoice
- `POST /invoices/{id}/export` - Export invoice to PDF

## Security Features

- JWT-based authentication with AWS Cognito
- API Gateway with Cognito authorizer
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- Secure file storage with S3 presigned URLs

## Cost Optimization

- Serverless architecture (pay-per-use)
- DynamoDB on-demand pricing
- S3 intelligent tiering
- CloudFront CDN for global distribution
- AWS Free Tier eligible services

## Deployment

The application is designed for easy deployment to AWS:

1. Backend deploys as serverless functions
2. Frontend can be hosted on S3 + CloudFront
3. Infrastructure as Code with SAM templates
4. Environment-specific configurations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.