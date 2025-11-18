import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

type Camera = 'PerspectiveCamera' | 'OrthographicCamera'

interface WebGLProps extends THREE.WebGLRendererParameters {
  backgroundColor?: THREE.ColorRepresentation
  axesHelper?: boolean
  gridHelper?: boolean
  cameraType?: Camera
  domClass?: string
}

export default class WebGL {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer

  constructor({ axesHelper = false, gridHelper = false, cameraType, domClass, ...options }: WebGLProps) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(options.backgroundColor || 0x202020)

    const width = window.innerWidth
    const height = window.innerHeight

    this.camera = this.createCamera(cameraType || 'PerspectiveCamera')
    this.renderer = new THREE.WebGLRenderer({ ...options })

    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    window.addEventListener('resize', () => {
      const width = window.innerWidth
      const height = window.innerHeight

      if (this.camera instanceof THREE.PerspectiveCamera) {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
      }

      this.renderer.setSize(width, height)
    })

    if (!domClass) {
      document.body.appendChild(this.renderer.domElement)
      this.renderer.domElement.classList.add('three-canvas')
    } else {
      document.querySelector(`.${domClass}`)?.appendChild(this.renderer.domElement)
      this.renderer.domElement.classList.add('three-canvas')
    }

    this.renderer.render(this.scene, this.camera)

    if (axesHelper) {
      this.createAxesHelper(5)
    }

    if (gridHelper) {
      this.createGridHelper(10, 10)
    }
  }

  createCamera(type: Camera): THREE.Camera {
    let camera: THREE.Camera

    switch (type) {
      case 'PerspectiveCamera':
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        break
      case 'OrthographicCamera':
        camera = new THREE.OrthographicCamera(
          window.innerWidth / -2,
          window.innerWidth / 2,
          window.innerHeight / 2,
          window.innerHeight / -2,
          1,
          1000
        )
        break
      default:
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        break
    }

    if (type == 'PerspectiveCamera') {
      camera.position.set(0, 0, 5)
    }

    if (type == 'OrthographicCamera') {
      camera.position.set(0, 0, 100)
    }

    return camera
  }

  createGridHelper(
    size?: number | undefined,
    divisions?: number | undefined,
    color1?: THREE.ColorRepresentation | undefined,
    color2?: THREE.ColorRepresentation
  ) {
    const gridHelper = new THREE.GridHelper(size, divisions, color1, color2)
    this.scene.add(gridHelper)
  }

  createAxesHelper(size?: number | undefined) {
    const axesHelper = new THREE.AxesHelper(size)
    this.scene.add(axesHelper)
  }

  useOrbitControls() {
    const orbit = new OrbitControls(this.camera, this.renderer.domElement)
    orbit.update()
  }
}
