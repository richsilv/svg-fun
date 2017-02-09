import permutation, { sumFactorials } from './permutation'

export function makeVars () {
  const a = makeInteger(50, 25)
  const b = makeInteger(50, 25)
  const l = Math.random()
  const kd = makeInteger(20, 1)
  const kn = makeInteger(kd, 1)
  const numPaths = makeInteger(12, 2)
  const numPoints = makeInteger(16, 8)
  const pointOrderInt = makeInteger(100000000000000)
  const curvedPath = makeInteger(2)
  const colors = Array(3).fill(0).map(makeColor)
  const lineCount = Math.floor(Math.random() * 10) + 2
  const fontSize = makeInteger(60, 20)
  const fontPosition = {
    x: makeInteger(80, -120),
    y: makeInteger(120, -80)
  }
  const fontColor = mergeColors({ colors, ratio: Math.random() })
  const translate = {
    x: makeInteger(25),
    y: makeInteger(25)
  }
  const angMult = makeInteger(5, 1)

  return {
    colors,
    lineCount,
    a,
    b,
    l,
    kn,
    kd,
    numPaths,
    numPoints,
    pointOrderInt,
    curvedPath,
    translate,
    angMult,
    fontSize,
    fontPosition,
    fontColor
  }
}

function makeColor () {
  return Math.floor(Math.random() * Math.pow(16, 6)).toString(16)
}

export function makePath (params) {
  const { pointFunc, numPoints, curvedPath } = params
  const pointOrderInt = params.pointOrderInt % sumFactorials[numPoints - 1]
  const pointOrder = permutation(pointOrderInt)
  const points = pointFunc(params)
  const pathFunc = curvedPath ? makeCurvePath : makeLinePath
  const path = pathFunc({ pointOrder, points })
  return path
}

function makeLinePath ({ pointOrder, points }) {
  const firstPointInd = pointOrder.shift()
  pointOrder.push(firstPointInd)
  const firstPoint = points[firstPointInd]

  let path = `M ${firstPoint.x},${firstPoint.y}\n`

  const fCInds = pointOrder.splice(0, 2)
  const fCPoints = fCInds.map((ind) => points[ind])
  path += `L ${fCPoints[0].x},${fCPoints[0].y} ${fCPoints[1].x},${fCPoints[1].y}\n`

  let nextInd
  while (pointOrder.length) {
    nextInd = pointOrder.shift()
    const nextPoint = points[nextInd]
    path += `L ${nextPoint.x},${nextPoint.y}\n`
  }

  return path + 'Z\n'
}

function makeCurvePath ({ pointOrder, points }) {
  const firstPointInd = pointOrder.shift()
  pointOrder.push(firstPointInd)
  const firstPoint = points[firstPointInd]

  let path = `M ${firstPoint.x},${firstPoint.y}\n`

  const fCInds = pointOrder.splice(0, 3)
  const fCPoints = fCInds.map((ind) => points[ind])
  path += `C ${fCPoints[0].x},${fCPoints[0].y} ${fCPoints[1].x},${fCPoints[1].y} ${fCPoints[2].x},${fCPoints[2].y}\n`
  if (pointOrder.length % 2 === 1) pointOrder.shift()

  let nextInds
  while (pointOrder.length) {
    nextInds = pointOrder.splice(0, 2)
    const nextPoints = nextInds.map((ind) => points[ind])
    path += `S ${nextPoints[0].x},${nextPoints[0].y} ${nextPoints[1].x},${nextPoints[1].y}\n`
  }

  return path + 'Z\n'
}

function makeInteger (max = 100, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function makeWebFontUrl (fonts) {
  const font = fonts[makeInteger(fonts.length)]
  const variant = font.variants[makeInteger(font.variants.length)]
  const url = `https://fonts.googleapis.com/css?family=${font.family.replace(/ /g, '+')}:${variant}`
  return { family: font.family, variant, url }
}

function pointOnEllipse ({ theta = 0, a = 1, b = 1 }) {
  const x = a * Math.cos(theta)
  const y = b * Math.sin(theta)
  return { x, y }
}

function pointOnSpirograph ({ theta = 0, R = 1, kn = 1, kd = 2, l = 0.5, ratio = 0, colors }) {
  const k = kn / kd
  const kFactor = (1 - k) / k
  const x = R * (((1 - k) * Math.cos(theta)) + (l * k * Math.cos(kFactor * theta)))
  const y = R * (((1 - k) * Math.sin(theta)) + (l * k * Math.sin(kFactor * theta)))
  const color = mergeColors({ colors, ratio })
  return { x, y, theta, color }
}

export function makeSpirograph ({ R, kn, kd, l, numPoints, colors = ['000000', 'ffffff'] }) {
  const timesRound = kn / hcd(kn, kd)
  const angles = range(Math.PI * 2 * timesRound, { count: numPoints })
  return angles.map((theta, ind) => pointOnSpirograph({ theta, R, kn, kd, l, colors, ratio: ind / numPoints }))
}

export function makeEllipse ({ a, b, numPoints }) {
  const angles = range(Math.PI * 2, { count: numPoints })
  return angles.map((theta) => pointOnEllipse({ theta, a, b }))
}

function range (max, { count, inc = 1 }) {
  if (count) inc = max / count
  else count = Math.floor(max / inc)
  return Array(count).fill(0).map((_, ind) => ind * inc)
}

function hcd (a, b) {
  const min = Math.min(a, b)
  const maxPotDenom = Math.floor(Math.pow(min, 0.5))
  let maxDenom = 1
  for (let i = 2; i <= maxPotDenom; i += 1) {
    if (a % i === 0 && b % i === 0) maxDenom = i
  }
  return maxDenom
}

function mergeColors ({ colors, ratio }) {
  const colorsMerged = [0, 2, 4].map((ind) => {
    return Math.floor(ratio * parseInt(colors[0].substr(ind, 2), 16) +
      (1 - ratio) * parseInt(colors[1].substr(ind, 2), 16))
  })
  return colorsMerged.map((colorNum) => pad(colorNum.toString(16), 2)).join('')
}

function pad (str, num) {
  const extra = num -str.length
  return Array(extra).fill('0').join('') + str
}
