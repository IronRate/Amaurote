import { SourceManager } from "./source-manager";

export class MaterialManager extends SourceManager{
    constructor(){
        super();
    }

    load(name:string){
        this.list[name]=null;
    }
}