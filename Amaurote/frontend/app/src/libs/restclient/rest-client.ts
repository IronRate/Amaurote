export class RestClient {
  private _baseAddress: string;
  public get baseAddress() {
    return this._baseAddress;
  }
  public set baseAddress(url: string) {
    this._baseAddress = url;
  }

  constructor() {}

  public post<T>(address: string, body?: any): Promise<T> {
    const self = this;
    return new Promise((resolve, reject) => {
      var native = self._createNativeClient();
      native.open("POST", self.baseAddress + address, true);
      native.setRequestHeader("Content-Type", "json/text; charset=utf-8");
      native.onreadystatechange = function() {
        if (native.readyState == 4) {
          if (native.status === 200) {
            resolve(<T>JSON.parse(native.responseText));
          } else {
            reject(native.responseText);
          }
        }
      };
      native.send(body ? JSON.stringify(body) : undefined);
    });
  }

  public put<T>(address: string, body?: any): Promise<T> {
    const self = this;
    return new Promise((resolve, reject) => {
      var native = self._createNativeClient();
      native.open("PUT", self.baseAddress + address, true);
      native.setRequestHeader("Content-Type", "json/text; charset=utf-8");
      native.onreadystatechange = function() {
        if (native.readyState == 4) {
          if (native.status === 200) {
            resolve(<T>JSON.parse(native.responseText));
          } else {
            reject(native.responseText);
          }
        }
      };
      native.send(body ? JSON.stringify(body) : undefined);
    });
  }

  public option(address:string):Promise<void>{
       const self = this;
    return new Promise((resolve, reject) => {
      var native = self._createNativeClient();
      native.open("OPTION", self.baseAddress + address, true);
      native.onreadystatechange = function() {
        if (native.readyState == 4) {
          if (native.status === 200) {
            resolve();
          } else {
            reject(native.responseText);
          }
        }
      };
      native.send();
    });
  }

  public get<T>(address: string): Promise<T> {
    const self = this;
    return new Promise((resolve, reject) => {
      var native = self._createNativeClient();
      native.open("GET", self.baseAddress + address, true);
      native.responseType = "json";
      native.onreadystatechange = function() {
        if (native.readyState == 4) {
          if (native.status === 200) {
            resolve(<T>JSON.parse(native.responseText));
          } else {
            reject(native.responseText);
          }
        }
      };
      native.send();
    });
  }

  public getBlob(address: string): Promise<Blob> {
    const self = this;
    return new Promise((resolve, reject) => {
      var native = self._createNativeClient();
      native.open("GET", self.baseAddress + address, true);
      native.responseType = "blob";
      native.onreadystatechange = function() {
        if (native.readyState == 4) {
          if (native.status === 200) {
            resolve(new Blob(native.response));
          } else {
            reject(native.responseText);
          }
        }
      };
      native.send();
    });
  }

  public getArrayBuffer(address: string): Promise<ArrayBuffer> {
    const self = this;
    return new Promise((resolve, reject) => {
      var native = self._createNativeClient();
      native.open("GET", self.baseAddress + address, true);
      native.responseType = "arraybuffer";
      native.onreadystatechange = function() {
        if (native.readyState == 4) {
          if (native.status === 200) {
            resolve(native.response);
          } else {
            reject(native.responseText);
          }
        }
      };
      native.send();
    });
  }

  public delete(address: string): Promise<void> {
    const self = this;
    return new Promise((resolve, reject) => {
      var native = self._createNativeClient();
      native.open("DELETE", self.baseAddress + address, true);
      native.onreadystatechange = function() {
        if (native.readyState == 4) {
          if (native.status === 200) {
            resolve();
          } else {
            reject(native.responseText);
          }
        }
      };
      native.send();
    });
  }

  private _createNativeClient(): XMLHttpRequest {
    if (XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if ((<any>window).ActiveXObject) {
      try {
        return new (<any>window).ActiveXObject("Microsoft.XMLHTTP");
      } catch (CatchException) {
        return new (<any>window).ActiveXObject("Msxml2.XMLHTTP");
      }
    }
  }
}
