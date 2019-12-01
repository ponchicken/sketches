import canvasSketch from 'canvas-sketch'
import { lerp } from 'canvas-sketch-util/math'
import random from 'canvas-sketch-util/random'
import colors from 'nice-color-palettes'

const settings = {
  dimensions: [ 2048, 2048 ]
}

const pickNewPoint = (points, existing, x) => {
  let tryCount = 0
  let result = random.pick(points)

  while (
    tryCount++ < 10 && (
      existing.includes(result) ||
      x === result[0]
    )
  ) {
    result = random.pick(points)
  }

  return result
}

const sketch = () => {
  // random.setSeed(19)
  const margin = 300

  const colorCount = random.rangeFloor(4, 6)
  const palette = random.shuffle(random.pick(colors)).slice(0, colorCount)

  const createGrid = () => {
    const points = []

    const count = 20

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const devider = count > 1 ? count - 1 : 0.5

        const u = x / devider
        const v = y / devider

        points.push([ u, v ])
      }
    }

    return points
  }

  const createShapes = (points) => {
    const shapes = []
    const existingPoints = []

    const count = 5

    for (let i = 0; i < count; i++) {
      const coord1 = pickNewPoint(points, existingPoints)
      const coord2 = pickNewPoint(points, existingPoints, coord1[0])

      const position = [
        coord1,
        coord2,
        [coord2[0], 1],
        [coord1[0], 1]
      ]

      shapes.push({
        color: random.pick(palette),
        position
      })
      existingPoints.push(...position)
    }

    return shapes
  }

  const points = createGrid().filter(() => random.value() > 0.8)
  const shapes = createShapes(points)

  return ({ context, width, height }) => {
    context.fillStyle = '#222'
    context.fillRect(0, 0, width, height)

    shapes.forEach(({
      position,
      color
    }) => {
      context.beginPath()
      const startX = lerp(margin, width - margin, position[0][0])
      const startY = lerp(margin, height - margin, position[0][1])

      context.moveTo(startX, startY)
      position.forEach(([u, v]) => {
        const x = lerp(margin, width - margin, u)
        const y = lerp(margin, height - margin, v)

        context.lineTo(x, y)
      })
      context.lineTo(startX, startY)

      context.fillStyle = color
      context.fill()

      context.lineWidth = 10
      context.strokeStyle = 'black'
      context.stroke()
      context.closePath()
    })
  }
}

canvasSketch(sketch, settings)
