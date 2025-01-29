function notFound(_, res) {
  return res.status(404).json({ message: 'page not found' });
}

module.exports = notFound;
