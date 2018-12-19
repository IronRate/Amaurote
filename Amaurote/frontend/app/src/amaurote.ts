import { ResourceManager } from "./components/resource-manager";
import { World } from "./components/world";
import THREE = require("three");
import FirstPersonControls from "first-person-controls";

export class Amaurote {
  private static enclosureThis: Amaurote;
  private frustumSize = 75;

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
  resourceManager: ResourceManager;

  constructor() {
    Amaurote.enclosureThis = this;
    this.resourceManager = new ResourceManager();
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
    this.initMeterials();
    this.initLights();
    this.initWorld();
    this.initScene();
  }

  private initMeterials() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/content/textures/brickwall.jpg");
    this.resourceManager.materials.add(
      "grass",
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        map: texture
      })
    );

    this.resourceManager.materials.add(
      "sand",
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
        flatShading: true,
        map: texture
      })
    );
    this.resourceManager.materials.add(
      "water",
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        map: texture
      })
    );
    this.resourceManager.materials.add(
      "stone",
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture
      })
    );
  }

  private initLights() {
    this.scene.add(new THREE.AmbientLight(0x111111));
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.125);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    this.scene.add(directionalLight);
    var pointLight = new THREE.PointLight(0xffffff, 1);
    this.scene.add(pointLight);
    pointLight.add(
      new THREE.Mesh(
        new THREE.SphereBufferGeometry(4, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      )
    );
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

    this.camera.position.set(-100, 100, 100);
  }

  private initUserControl() {
    // this.controls = new FirstPersonControls(this.camera);
    // this.controls.movementSpeed = 1;
    // this.controls.lookSpeed = 0.1;
    //this.controls = new THREE.Map
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2;
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
    for (let i = 0; i < this.world.objects.length; i++) {
      let coord = this.world.getCoord(i);
      let mesh: THREE.Mesh = null;
      switch (this.world.objects[i].groundType) {
        case 1:
        case 2:
        case 3:
          var geometry = new THREE.BoxGeometry(10.0, 10.0, 10.0);
          mesh = new THREE.Mesh(
            geometry,
            this.resourceManager.materials.get("grass")
          );
          break;
        case 4:
        case 5:
        case 6:
          var geometry = new THREE.BoxGeometry(10.0, 10.0, 10.0);
          mesh = new THREE.Mesh(
            geometry,
            this.resourceManager.materials.get("sand")
          );
          break;
        case 7:
          var geometry = new THREE.BoxGeometry(10.0, 10.0, 10.0);
          mesh = new THREE.Mesh(
            geometry,
            this.resourceManager.materials.get("water")
          );
          break;
        default:
          var geometry = new THREE.BoxGeometry(10.0, 10.0, 10.0);
          mesh = new THREE.Mesh(
            geometry,
            this.resourceManager.materials.get("stoune")
          );
          break;
      }
      if (mesh) {
        mesh.position.set(
          -((this.world.sizeX / 2) * 10) + coord.x * 10,
          0,
          -((this.world.sizeY / 2) * 10) + coord.y * 10
        );
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

    // self.mesh.rotation.x += 0.01;
    // self.mesh.rotation.y += 0.02;
    // self.theta += 0.1;
    // self.camera.position.x =
    //   self.radius * Math.sin(THREE.Math.degToRad(self.theta));
    // self.camera.position.y =
    //   self.radius * Math.sin(THREE.Math.degToRad(self.theta));
    // self.camera.position.z =
    //   self.radius * Math.cos(THREE.Math.degToRad(self.theta));
    self.camera.lookAt(0, 0, 1);
    self.camera.updateProjectionMatrix();

    self.renderer.render(self.scene, self.camera);
    if (self.controls) {
      self.controls.update(self.clock.getDelta());
    }
  }

  private renderingWorld() {}
}

export const AmauroteGame = new Amaurote();
