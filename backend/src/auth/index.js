const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };

    try {
        const { httpMethod, path } = event;
        const body = JSON.parse(event.body || '{}');

        if (path === '/auth/signup') {
            return await handleSignup(body, headers);
        } else if (path === '/auth/login') {
            return await handleLogin(body, headers);
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Not found' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

async function handleSignup(body, headers) {
    const { email, password, companyName } = body;

    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'custom:company_name', Value: companyName }
        ]
    };

    const result = await cognito.signUp(params).promise();
    
    // Store user info in DynamoDB
    await dynamodb.put({
        TableName: process.env.USERS_TABLE,
        Item: {
            user_id: result.UserSub,
            email,
            company_name: companyName,
            created_at: new Date().toISOString(),
            invoice_counter: 0
        }
    }).promise();

    return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
            message: 'User created successfully',
            userId: result.UserSub 
        })
    };
}

async function handleLogin(body, headers) {
    const { email, password } = body;

    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    };

    const result = await cognito.initiateAuth(params).promise();

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            accessToken: result.AuthenticationResult.AccessToken,
            refreshToken: result.AuthenticationResult.RefreshToken,
            idToken: result.AuthenticationResult.IdToken
        })
    };
}