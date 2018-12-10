import { World } from "./components/world";
import THREE = require("three");
import FirstPersonControls from "first-person-controls";

export class Amaurote {
  private static enclosureThis: Amaurote;
  private frustumSize = 1000;

  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  renderer: THREE.Renderer;
  geometry: THREE.Geometry;
  material: THREE.Material;
  mesh: THREE.Mesh;
  controls: FirstPersonControls;
  clock: THREE.Clock;
  radius = 500;
  theta = 0;
  world: World;

  constructor() {
    Amaurote.enclosureThis = this;
    this.init();
    this.rendering();
  }

  private init() {
    this.initCamera();
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock(true);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onResize);
    this.onResize();
    //this.initUserControl();
    this.initWorld();
    this.initScene();
  }

  private initCamera() {
    var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera(
    //   70,
    //   window.innerWidth / window.innerHeight,
    //   0.01,
    //   10
    // );
    // this.camera.position.z = 1;
    this.camera = new THREE.OrthographicCamera(
      (this.frustumSize * aspect) / -2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      1,
      1000
    );

    this.camera.position.set(-200, 200, 200);
  }

  private initUserControl() {
    this.controls = new FirstPersonControls(this.camera);
    this.controls.movementSpeed = 1;
    this.controls.lookSpeed = 0.1;
  }

  private initScene() {
    const helper = new THREE.GridHelper(
      this.world.sizeX,
      10,
      0x0000ff,
      0x808080
    );
    helper.position.y = -10;
    this.scene.add(helper);

    this.geometry = new THREE.BoxGeometry(10, 10, 10);
    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  private initWorld() {
    this.world = new World(50, 50);
    for (var i = 0; i < this.world.objects.length; i++) {
      let coord = this.world.getCoord(i);
      let mesh: THREE.Mesh = null;
      switch (this.world.objects[i].groundType) {
        case 1:
          var geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
          //var material = new THREE.MeshNormalMaterial();
          mesh = new THREE.Mesh(geometry, this.material);
          mesh.position.set(coord.x, 0, coord.y);
          break;
      }
      if (mesh) {
        this.scene.add(mesh);
      }
    }
  }

  private onResize() {
    const self = Amaurote.enclosureThis;
    if (self.renderer) {
      var aspect = window.innerWidth / window.innerHeight;
      self.camera.left = (-self.frustumSize * aspect) / 2;
      self.camera.right = (self.frustumSize * aspect) / 2;
      self.camera.top = self.frustumSize / 2;
      self.camera.bottom = -self.frustumSize / 2;
      self.camera.updateProjectionMatrix();
      self.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  private rendering() {
    const self = Amaurote.enclosureThis;
    requestAnimationFrame(self.rendering);

    self.mesh.rotation.x += 0.01;
    self.mesh.rotation.y += 0.02;
    // self.theta += 0.1;
    // self.camera.position.x =self.radius * Math.sin(THREE.Math.degToRad(self.theta));
    // self.camera.position.y =self.radius * Math.sin(THREE.Math.degToRad(self.theta));
    // self.camera.position.z =self.radius * Math.cos(THREE.Math.degToRad(self.theta));
    self.camera.lookAt(self.scene.position);
    // self.camera.updateMatrixWorld(false);

    self.renderer.render(self.scene, self.camera);
    if (self.controls) {
      self.controls.update(self.clock.getDelta());
    }
  }

  private renderingWorld() {}
}

export const AmauroteGame = new Amaurote();
