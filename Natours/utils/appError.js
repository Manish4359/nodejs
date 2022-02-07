class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

  //  console.log('apperrrrrrrr');
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'Error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
