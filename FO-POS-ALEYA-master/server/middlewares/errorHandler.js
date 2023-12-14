const errorHandler = (err, _req, res, _next) => {
  // error id is just a random number
  // used to track where the error came from

  let error = {
    id: 1001,
    message: 'Internal Server Error',
    code: 500,
  }

  if (typeof err === 'string') {
    error.message = err
  } else if (err.response) {
    if (err.response.status && err.response.statusText) {
      error.code = err.response.status
      error.message = err.response.statusText
    }
    if (err.response.data?.message) {
      error.message = err.response.data.message

      if (err.response.status) {
        error.code = err.response.status
      }
    }
  } else if (err.id) {
    error = err
  } else if (err.message) {
    error.id = 1002
    error.message = err.message
  }

  res.status(error.code).json({ error })
}

export default errorHandler
