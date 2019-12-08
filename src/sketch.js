global.THREE = require('three')
require('three/examples/js/controls/OrbitControls')

const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')

const THREE = global.THREE

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl'
}

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  })

  // WebGL background color
  renderer.setClearColor('#111', 1)

  // Setup a camera
  const camera = new THREE.OrthographicCamera()

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas)

  // Setup your scene
  const scene = new THREE.Scene()

  // Setup a geometry
  // const geometry = new THREE.SphereGeometry(1, 32, 16)
  const box = new THREE.BoxGeometry(1, 1, 1)

  const palette = random.pick(palettes)

  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette)
      })
    )
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    )
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    )
    mesh.scale.multiplyScalar(0.5)

    scene.add(mesh)
  }

  const light = new THREE.DirectionalLight('white', 1)
  light.position.set(
    0, 1, 0.1
  )
  scene.add(light)
  scene.add(new THREE.AmbientLight('#121'))

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(viewportWidth, viewportHeight, false)

      const aspect = viewportWidth / viewportHeight

      // Ortho zoom
      const zoom = 2.0

      // Bounds
      camera.left = -zoom * aspect
      camera.right = zoom * aspect
      camera.top = zoom
      camera.bottom = -zoom

      // Near/Far
      camera.near = -100
      camera.far = 100

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom)
      camera.lookAt(new THREE.Vector3())

      // Update the camera
      camera.updateProjectionMatrix()
    },
    // Update & render your scene here
    render ({ time }) {
      // mesh.rotation.y = time * 0.09
      // mesh.rotation.x = time * 0.07
      renderer.render(scene, camera)
      controls.update()
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      renderer.dispose()
      controls.dispose()
    }
  }
}

canvasSketch(sketch, settings)
