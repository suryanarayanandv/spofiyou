const { STATUS_BAD_REQUEST } = require("./const");

/**
 * REST API Utils
 */
function formResponse(status, message) {
  const response = {
    status,
    message
  };

  return JSON.stringify(response);
}

function handleError(res, error) {
    console.error('Error:', error);
    const response = {
        status: error.status || STATUS_BAD_REQUEST,
        message: error.message || 'An unexpected error occurred}',
    }

    return JSON.stringify(response);
}

function sendRestResponse(res, status, body) {
    res.setHeader("Content-Type", "application/json");
    res.status(status).send(body);
    res.end();
}

module.exports = {
    formResponse,
    handleError,
    sendRestResponse
};