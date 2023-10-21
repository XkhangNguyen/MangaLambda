function handleErrors(error) {
    // Log the error or send it to a monitoring service
    console.error('Error:', error);

    // Return a structured error response
    return {
        statusCode: 500,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Internal Server Error' }),
    };
}

export default handleErrors;