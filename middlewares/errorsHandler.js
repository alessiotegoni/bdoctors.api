function errorsHandler(err, _, res, _) {
  if (err)
    res.status(500).json({
      message: err.message,
    })
}

module.exports = errorsHandler
