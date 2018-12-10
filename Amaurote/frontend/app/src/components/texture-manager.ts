import { ImageManager } from "./image-manager";
import { SourceManager } from "./source-manager";

export class TextureManager extends SourceManager {
  constructor(public imageManager: ImageManager) {
    super();
  }
}
