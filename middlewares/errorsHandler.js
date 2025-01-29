function errorsHandler(err, _, res, _) {
  console.error(err.stack);
  if (err)
    return res.status(500).json({
      message: err.message,
    });
}

module.exports = errorsHandler;
