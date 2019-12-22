const canvasSketch = require('canvas-sketch')
const createShader = require('canvas-sketch-util/shader')
const glsl = require('glslify')

const settings = {
  context: 'webgl',
  animate: true
}

const frag = glsl`
  precision highp float;

  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb')

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  void main () {
    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist = length(center);
    float alpha = smoothstep(0.25, 0.23, dist);

    float n = snoise3(vec3(center * 5.0, time * 1.0));
    vec3 color = hsl2rgb(
      0.1 + n * 0.2,
      0.8,
      0.4
    );
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
