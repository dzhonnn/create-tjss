import './style.css'
import WebGL from './WebGL'
import * as THREE from 'three'
import vertexShader from './shaders/vert.glsl'
import fragmentShader from './shaders/frag.glsl'

const webGlRenderer = new WebGL({ antialias: true })
const scene = webGlRenderer.scene
const camera = webGlRenderer.camera
const renderer = webGlRenderer.renderer

webGlRenderer.useOrbitControls()

let uniforms = {
  uTime: { type: 'f', value: 0.0 },
}

const planeGeometry = new THREE.PlaneGeometry(3, 3)
const planeMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

const clock = new THREE.Clock()

function animate() {
  uniforms.uTime.value = clock.getElapsedTime()

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
