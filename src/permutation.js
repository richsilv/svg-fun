export const factorials = [1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000]
export const sumFactorials = factorials.reduce((sums, factorial) => { sums.push((sums.slice(-1)[0] || 0) + factorial); return sums }, [])

function mapToRelIndices (num) {
  let quot = num
  let indices = []
  let i
  for (i = 1; quot > 0; i += 1) {
    indices.unshift(quot % i)
    quot = Math.floor(quot / i)
  }
  return indices
}

function relToAbsIndices (relIndices) {
  let indStore = Array(relIndices.length).fill(0).map((_, ind) => ind)
  return relIndices.map((relInd) => {
    return indStore.splice(relInd, 1)[0]
  })
}

export default function mapToAbsoluteIndices (num) {
  return relToAbsIndices(mapToRelIndices(num))
}
