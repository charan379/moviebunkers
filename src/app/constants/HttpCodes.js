exports.HttpCodes = {
  OK: {
    code: 200,
    info: "Everything is working",
  },
  CREATED: {
    code: 201,
    info: "A new resource has been created",
  },
  BAD_REQUEST: {
    code: 400,
    info: "The request was invalid or cannot be served",
  },
  UNATHORIZED: {
    code: 401,
    info: "The request requires user authentication",
  },
  FORBIDDEN: {
    code: 403,
    info:
      "The server understood the request but is refusing it or the access is not allowed",
  },
  NOT_FOUND: {
    code: 404,
    info: 'There is no resource behind the URI'
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    info: 'API developers should avoid this error. If an error occurs in the global catch blog, the stack trace should be logged and not returned as a response'
  }
};
