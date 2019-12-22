const canvasSketch = require('canvas-sketch')
const createShader = require('canvas-sketch-util/shader')
const glsl = require('glslify')

const settings = {
  context: 'webgl',
  animate: true
}

const frag = glsl`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  void main () {
    vec3 colorA = vec3(0.7, 0.0, 0.5);
    vec3 colorB = vec3(0.0, 0.1, 0.4);

    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist = length(center);

    float alpha = smoothstep(cos(time * 0.2) * 0.1 + 0.1, sin(time * 1.5 + sin(time * 5.0)) * 0.5 + 0.2, dist);

    vec3 color = mix(colorA, colorB, sin(time * 8.0 + vUv.y ) + cos(time - vUv.x));
    gl_FragColor = vec4(color, alpha);
  }
`

const sketch = ({ gl }) => {
  return createShader({
    clearColor: 'black',
    gl,
    frag,
    uniforms: {
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height
    }
  })
}

canvasSketch(sketch, settings)
