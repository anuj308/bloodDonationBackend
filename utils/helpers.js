module.exports = {
    // Example utility function
    formatResponse: (data, message = 'Success') => {
        return {
            status: 'success',
            message,
            data,
        };
    },

    // Another utility function
    handleError: (error) => {
        return {
            status: 'error',
            message: error.message || 'An error occurred',
        };
    },
};