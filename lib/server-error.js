class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const createError = (message, status) => {
  throw new CustomError(message, status);
};

const errorResponse = (error) => {
  if (error instanceof CustomError) {
    return Response.error({ error: error.message });
  } else {
    console.error(error);
    return Response.error({ error: "Internal Server Error" });
  }
};

export { createError, errorResponse };

