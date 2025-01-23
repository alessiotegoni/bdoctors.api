function notFound(_, res) {
  res.status(404).json({ message: 'page not found' })
}

module.exports = notFound
