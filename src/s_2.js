import canvasSketch from 'canvas-sketch'
import { lerp } from 'canvas-sketch-util/math'
import random from 'canvas-sketch-util/random'
import colors from 'nice-color-palettes'

const settings = {
  dimensions: [ 2048, 2048 ]
}

const sketch = () => {
  // random.setSeed(19)
  const margin = 300
  const size = 500

  const colorCount = random.rangeFloor(1, 6)
  const palette = random.shuffle(random.pick(colors)).slice(0, colorCount)

  const createGrid = () => {
    const points = []
    const count = 50

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const devider = count > 1 ? count - 1 : 0.5

        const u = x / devider
        const v = y / devider

        const radius = Math.abs(random.noise2D(u, v, 0.5, 1)) * size
        const rotation = random.noise2D(u, v)

        points.push({
          color: random.pick(palette),
          position: [ u, v ],
          radius,
          rotation
        })
      }
    }

    return points
  }

  const points = createGrid().filter(() => random.value() > 0.8)

  return ({ context, width, height }) => {
    context.fillStyle = '#222'
    context.fillRect(0, 0, width, height)

    points.forEach(({
      position: [ u, v ],
      radius,
      color,
      rotation
    }) => {
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)

      // context.beginPath()
      // context.arc(x, y, radius, 0, Math.PI * 2, false)

      // context.fillStyle = color
      // context.fill()

      context.save()

      context.fillStyle = color
      context.font = `${radius}px "Helvetica"`
      context.translate(x, y)
      context.rotate(rotation)
      context.fillText('-', 0, 0)

      context.restore()
    })
  }
}

canvasSketch(sketch, settings)
