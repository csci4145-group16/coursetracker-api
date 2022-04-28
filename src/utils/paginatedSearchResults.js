export default async (model, searchField, searchValue, startAt = 0, limit) => {
  const scanIncrement = 100
  const results = {
    results: [],
  }
  let res = {}
  let totalScannedCount = 0
  let totalExtrasScannedCount = 0
  try {
    res.lastKey = startAt ? { id: startAt } : startAt
    while (results.results.length < limit && res.lastKey !== undefined) {
      res = await model
        .scan(searchField)
        .beginsWith(searchValue.toLowerCase())
        .limit(scanIncrement)
        .startAt(res.lastKey)
        .exec()
      totalScannedCount += res.scannedCount
      results.results = results.results.concat(res)
    }

    results.hasMore = res.lastKey !== undefined

    if (results.results.length < limit && !results.hasMore) {
      res.lastKey = startAt ? { id: startAt } : startAt
    }
    while (results.results.length < limit && res.lastKey !== undefined) {
      res = await model
        .scan(searchField)
        .contains(searchValue.toLowerCase())
        .limit(scanIncrement)
        .startAt(res.lastKey)
        .exec()
      totalExtrasScannedCount += res.scannedCount
      res.forEach((extra) => {
        if (!results.results.find((result) => result.id === extra.id)) {
          results.results.push(extra)
        }
      })
    }
    if (!results.hasMore) results.hasMore = res.lastKey !== undefined
    results.lastKey = res.lastKey?.id
    return results
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
