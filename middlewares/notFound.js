function notFound(_, res) {
  res.status(404).json({
    error: 'not found',
    message: 'pagina non trovata',
  })
}

module.exports = notFound
