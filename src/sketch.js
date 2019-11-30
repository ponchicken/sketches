import canvasSketch from 'canvas-sketch'
import { lerp } from 'canvas-sketch-util/math'

const settings = {
  dimensions: [ 2048, 2048 ]
}

const sketch = () => {
  const createGrid = () => {
    const points = []
    const count = 32

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

  const points = createGrid()
    .filter(() => Math.random() > 0.5)
  const margin = 100
  const size = 20
  const lineWidth = 10

  return ({ context, width, height }) => {
    context.fillStyle = '#333'
    context.fillRect(0, 0, width, height)

    context.fillStyle = '#dca'

    points.forEach(([ u, v ]) => {
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)

      context.beginPath()
      context.arc(x, y, size, 0, Math.PI * 2, false)

      context.strokeStyle = 'black'
      context.lineWidth = lineWidth
      context.stroke()
      context.fill()
    })
  }
}

canvasSketch(sketch, settings)
