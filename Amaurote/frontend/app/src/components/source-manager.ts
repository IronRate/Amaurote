export interface ISourceManager {
  load(name: string): void;
  get(name: string): any;
  add(name: string, source: any);
  remove(name: string): void;
  clear(): void;
}

export abstract class SourceManager implements ISourceManager {
  protected list: Map<string, any>=new Map<string,any>();
  constructor() {}

  public load(name: string) {}

  public add(name: string, source: any) {
    this.list[name] = source;
  }

  public get(name: string) {
    return this.list[name];
  }
  remove(name: string): void {
    this.list[name] = undefined;
  }
  clear(): void {
    this.list.clear();
  }
}
