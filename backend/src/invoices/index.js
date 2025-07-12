const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
    };

    try {
        const { httpMethod, path, pathParameters } = event;
        const userId = getUserIdFromToken(event.headers.Authorization);
        
        switch (httpMethod) {
            case 'POST':
                return await createInvoice(JSON.parse(event.body), userId, headers);
            case 'GET':
                if (pathParameters?.id) {
                    return await getInvoice(pathParameters.id, userId, headers);
                }
                return await getInvoices(userId, headers);
            case 'DELETE':
                return await deleteInvoice(pathParameters.id, userId, headers);
            default:
                return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

async function createInvoice(invoiceData, userId, headers) {
    const invoiceId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Get next invoice number
    const userResult = await dynamodb.get({
        TableName: process.env.USERS_TABLE,
        Key: { user_id: userId }
    }).promise();
    
    const nextInvoiceNumber = (userResult.Item?.invoice_counter || 0) + 1;
    
    // Update user's invoice counter
    await dynamodb.update({
        TableName: process.env.USERS_TABLE,
        Key: { user_id: userId },
        UpdateExpression: 'SET invoice_counter = :counter',
        ExpressionAttributeValues: { ':counter': nextInvoiceNumber }
    }).promise();

    const invoice = {
        user_id: userId,
        invoice_id: invoiceId,
        invoice_number: nextInvoiceNumber,
        ...invoiceData,
        created_at: timestamp,
        updated_at: timestamp
    };

    await dynamodb.put({
        TableName: process.env.INVOICES_TABLE,
        Item: invoice
    }).promise();

    return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
            message: 'Invoice created successfully',
            invoice: invoice
        })
    };
}

async function getInvoices(userId, headers) {
    const result = await dynamodb.query({
        TableName: process.env.INVOICES_TABLE,
        KeyConditionExpression: 'user_id = :userId',
        ExpressionAttributeValues: { ':userId': userId },
        ScanIndexForward: false
    }).promise();

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ invoices: result.Items })
    };
}

async function getInvoice(invoiceId, userId, headers) {
    const result = await dynamodb.get({
        TableName: process.env.INVOICES_TABLE,
        Key: { user_id: userId, invoice_id: invoiceId }
    }).promise();

    if (!result.Item) {
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Invoice not found' })
        };
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ invoice: result.Item })
    };
}

async function deleteInvoice(invoiceId, userId, headers) {
    await dynamodb.delete({
        TableName: process.env.INVOICES_TABLE,
        Key: { user_id: userId, invoice_id: invoiceId }
    }).promise();

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Invoice deleted successfully' })
    };
}

function getUserIdFromToken(authHeader) {
    // Extract user ID from JWT token (simplified)
    const token = authHeader?.replace('Bearer ', '');
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.sub;
}