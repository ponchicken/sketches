import canvasSketch from 'canvas-sketch'
import { lerp } from 'canvas-sketch-util/math'
import random from 'canvas-sketch-util/random'
import colors from 'nice-color-palettes'

const settings = {
  dimensions: [ 2048, 2048 ]
}

const sketch = () => {
  const margin = 300
  const size = 20

  const createGrid = () => {
    const points = []
    const count = 32

    const colorCount = random.rangeFloor(1, 6)
    const palette = random.shuffle(random.pick(colors)).slice(0, colorCount)

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const devider = count > 1 ? count - 1 : 0.5

        const u = x / devider
        const v = y / devider
        points.push({
          color: random.pick(palette),
          position: [ u, v ],
          radius: Math.abs(random.gaussian() * size)
        })
      }
    }

    return points
  }

  // random.setSeed(42)
  const points = createGrid().filter(() => random.value() > 0.5)

  return ({ context, width, height }) => {
    context.fillStyle = '#333'
    context.fillRect(0, 0, width, height)

    points.forEach(({
      position: [ u, v ],
      radius,
      color
    }) => {
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)

      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2, false)

      context.fillStyle = color
      context.fill()
    })
  }
}

canvasSketch(sketch, settings)
