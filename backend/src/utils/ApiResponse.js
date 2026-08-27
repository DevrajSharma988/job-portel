class ApiResponse {
  constructor(res, statusCode, message, data) {
    const response = {
      success: true,
    };

    if (message != null) {
      response.message = message;
    }

    if (data != null) {
      Object.assign(response, data);
    }

    res.status(statusCode).json(response);
  }
}

export default ApiResponse;
