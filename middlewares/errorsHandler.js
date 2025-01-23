function errorsHandler(err, _, res, _) {
  if (err)
    res.status(err.status).json({
      message: err.message,
    });
}

module.exports = errorsHandler;
