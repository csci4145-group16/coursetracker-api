export default function (model) {
  return async (req, res, next) => {
    const { val } = req.params
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    const { count } = await model.scan().count().exec()
    if (endIndex < count) {
      results.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      }
    }

    try {
      results.results = await model
        .scan('searchName')
        .beginsWith(val.toLowerCase())
        .limit(limit)
        .startAt(startIndex)
        .exec()

      res.paginatedResults = results
      next()
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || err })
    }
  }
}
