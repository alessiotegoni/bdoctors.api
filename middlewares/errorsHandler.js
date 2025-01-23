function errorsHandler(err, _, res, _) {
  console.log(err);
  if (err)
    return res.status(err.status || 500).json({
      message: err.message,
    });
}

module.exports = errorsHandler;
