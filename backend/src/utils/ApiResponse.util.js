export class ApiResponse {
  constructor(res, statusCode, message, data) {
    const response = {
      success: true,
      message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    res.status(statusCode).json(response);
  }
}

export default ApiResponse;
