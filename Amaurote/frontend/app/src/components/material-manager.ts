import { TextureManager } from "./texture-manager";
import { SourceManager } from "./source-manager";

export class MaterialManager extends SourceManager {
  constructor(public textureManager: TextureManager) {
    super();
  }

  load(name: string) {
    this.list[name] = null;
  }
}
