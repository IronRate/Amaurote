import { TextureManager } from "./texture-manager";
import { MaterialManager } from "./material-manager";
import { ImageManager } from "./image-manager";
export class ResourceManager {
  images: ImageManager;
  materials: MaterialManager;
  textures: TextureManager;

  /**
   *
   */
  constructor() {
    this.images = new ImageManager();
    this.textures = new TextureManager(this.images);
    this.materials = new MaterialManager(this.textures);
  }
}
