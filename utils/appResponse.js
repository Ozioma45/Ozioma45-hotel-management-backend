const appResponse = (res, statusCode, success, message, data) => {
  const checkIfSuccess = statusCode?.toString().startsWith("2");

  return res.status(statusCode).json({
    success: checkIfSuccess ? true : false,
    message,
    data: data ?? null,
  });
};

module.exports = appResponse;
