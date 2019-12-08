export interface MBGlobal extends NodeJS.Global {
  makerbuild: any;
}
export interface JQModal extends JQuery {
  modal(thing: string): void;
}
export interface INPMModuleMap<CDN> {
  [bare: string]: string;
}
export interface IBareModuleResolver {
  bare: string;
  resolved: string;
}
export class JSDelivr {

}
export class NPMPackageList implements Iterable<IBareModuleResolver> {
  length: number;
  private items: string[] = [];
  constructor(pkgs: Array<string> = []) {
    this.items = pkgs;
  }
  install(name: string) {
    this.items.push(name);
    this.length++;
  }
  uninstall(name: string) {
    this.items.splice(this.items.indexOf(name));
  }
  isInstalled(name: string): boolean {
    return this.items.includes(name);
  } 
  get moduleMap(): INPMModuleMap<JSDelivr> {
    let map: INPMModuleMap<JSDelivr> = {};
    for(let mod of this.items) {
      map[mod] = `https://cdn.jsdelivr.net/npm/${mod}`;
    }
    return map;
  }
  *[Symbol.iterator]() {
    let map = this.moduleMap;
    let keys = Object.keys(map);
    let values = Object.values(map);
    for(let index in keys) {
      yield {bare: keys[index], resolved: values[index]};
    }
  }
  static fromResolverIterable(iterable: Iterable<IBareModuleResolver>): NPMPackageList {
    let list = Array.from<IBareModuleResolver>(iterable);
    return new NPMPackageList(list.map<string>(resolver => resolver.bare));
  }
  static resolve(name: string, cdn: 'jsdelivr' | 'unpkg' = 'jsdelivr'): IBareModuleResolver {
    switch(cdn) {
      case 'jsdelivr':
        return {bare: name, resolved: `https://cdn.jsdelivr.net/npm/${name}`};
      case 'unpkg':
        return {bare: name, resolved: `https://unpkg.com/${name}`};
    }
  }
}
interface IJSONable {
  text(): string
  json(): object
}
export function getSync(file: string): IJSONable {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', file, false);
  xhr.send();
  return {
    text() {
      return xhr.responseText;
    },
    json() {
      return JSON.parse(xhr.responseText);
    }
  }
}