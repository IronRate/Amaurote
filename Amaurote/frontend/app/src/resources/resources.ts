export interface IResourceItem {
  name: string;
}

export interface ITextureResource extends IResourceItem {
  imageName: string;
}

export interface IImageResource extends IResourceItem {
  url: string;
}

export enum MaterialType {
  None = 0,
  Phong = 1
}

export interface IMaterialResource extends IResourceItem {
  type: MaterialType;
  diffuseMap?: string;
  specularMap?: string;
  normalMap?: string;
}

export interface IResources {
  images: IImageResource[];
  textures: ITextureResource[];
  materials: IMaterialResource[];
}

export class Resources implements IResources {
  images: IImageResource[] = [
    {
      name: "brickwall",
      url: "/api/resources/images/brickwall.png"
    }
  ];
  textures: ITextureResource[] = [
    {
      name: "brickwall",
      imageName: "brickwall"
    }
  ];
  materials: IMaterialResource[] = [
    {
      name: "brickwall",
      type: MaterialType.Phong,
      diffuseMap: "brickwall"
    }
  ];
}
