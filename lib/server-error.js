class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const createError = (message, status = 500) => {
  throw new CustomError(message, status);
};

const errorResponse = (error) => {
  // console.error(error);
  if (error instanceof CustomError) {
    return Response.json({ message: error.message }, { status: error.status });
  } else {
    return Response.json(error, {
      status: 500,
      statusText: "internal server error",
    
    });
  }
};

export { createError, errorResponse };

