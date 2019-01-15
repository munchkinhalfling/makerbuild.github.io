// MakerBuild IDE Project Utility Library
// use `import * as makerbuild from 'makerbuild.js' to import

export function getFile(file) {
  return $MAKERBUILD_PROJECT[file];
}

export function getProjectConfig(key) {
  return JSON.parse(getFile("project.json"))[key];
}
