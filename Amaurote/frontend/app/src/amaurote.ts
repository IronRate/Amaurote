import * as THREE from "three.js";

export class Amaurote {
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.Renderer;
  geometry: THREE.Geometry;
  material: THREE.Material;
  mesh: THREE.Mesh;
  private static enclosureThis: Amaurote;

  constructor() {
    Amaurote.enclosureThis = this;
    this.init();
    this.rendering();
  }

  private init() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  private onResize() {
    const self = Amaurote.enclosureThis;
    if (self.renderer) {
      // this.camera.aspect = window.innerWidth / window.innerHeight;
      // this.camera.updateProjectionMatrix();
      self.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  private rendering() {
    const self = Amaurote.enclosureThis;
    requestAnimationFrame(self.rendering);

    self.mesh.rotation.x += 0.01;
    self.mesh.rotation.y += 0.02;

    self.renderer.render(self.scene, self.camera);
  }
}

export const AmauroteGame = new Amaurote();
