declare let ace: any;
declare function prompt(msg: string, val?: string): Promise<string>;
declare let __webpack_exports__: any;
import * as Babel from "babel-standalone";
import * as ts from "typescript";
import './prompt.js';
import {MBGlobal, NPMPackageList, JQModal, getSync} from "./util.ts";

var editor = ace.edit("editor");
var theme = "chrome";
var defaultProj = {
  "app.js": "// This is the main JavaScript file\n// Type code here."
};
var curProj = JSON.parse(localStorage["curProj"] || "{}");
var curFile;
var previewBlob;
var scriptBlobs = [];
var npmPackages = new NPMPackageList();
$.get("template_index.html", (data, status, xhr) => {
  defaultProj["index.html"] = data;
});
$.get("makerbuild.js", (data, status, xhr) => {
  defaultProj["makerbuild.js"] = data;
});
reloadTree();
editor.setTheme(`ace/theme/${theme}`);
editor.getSession().setMode("ace/mode/javascript");
editor.$blockScrolling = Infinity;
// DOWN and DIRTY NOW //
$("#nproj").on("click", async function(e) {
  var projName = await prompt("Project Name:", "Untitled Project");
  $("#projName").text(projName);
  curProj = defaultProj;
  curProj["project.json"] = `{
    "name": "${projName}",
    "version": "1.0.0",
    "createdWith": "MakerBuild IDE",
    "npm-packages": ${JSON.stringify(Array.from(new NPMPackageList()))}
}`;
  npmPackages = NPMPackageList.fromResolverIterable(JSON.parse(curProj['project.json'])['npm-packages']);
  reloadTree();
});
export const openFile = e => {
  editor.setValue(curProj[e.target.textContent]);
  curFile = e.target.textContent;
  switch (e.target.textContent.split(".")[1]) {
    case "js":
      editor.getSession().setMode("ace/mode/javascript");
      break;
    case "html":
      editor.getSession().setMode("ace/mode/html");
      break;
    default:
      break; // Ace usually auto-detects the file type //
  }
};
export const save = () => {
  curProj[curFile] = editor.getValue();
  localStorage["curProj"] = JSON.stringify(curProj);
  alert("Saved!");
};
export const newF = async () => {
  var fileName = await prompt("File name:", "unnamed.js");
  var fileContents;
  switch (fileName.split(".")[1]) {
    case "html":
      $.get("template_generic.html", (data, status, xhr) => {
        fileContents = data;
      });
      break;
    case "js":
      fileContents = "// This is a new file.";
      break;
    default:
      fileContents = "";
      break;
  }
  curProj[fileName] = fileContents;
  reloadTree();
};
export const preview = () => {
  var blobURL = getBundle();
  $("#previewIframe").attr("src", blobURL);
  $("#previewModalTitle").text(
    (() => {
      let previewiFrame: HTMLIFrameElement = document.querySelector(
        "#previewIframe"
      );
      return previewiFrame.contentDocument.title;
    })()
  );
  (<JQModal>$("#previewModal")).modal("show");
};
function reloadTree() {
  $("#fileTree").html("");
  $("#projName").html(
    JSON.parse(
      curProj && "project.json" in curProj
        ? curProj["project.json"]
        : '{"name": "<No Project>"}'
    ).name
  );
  $("title").html(
    "MakerBuild IDE - " +
      JSON.parse(
        curProj && "project.json" in curProj
          ? curProj["project.json"]
          : '{"name": "<No Project>"}'
      ).name
  );
  for (let file in curProj) {
    $("#fileTree").append(
      `<li onclick='makerbuild.openFile(event)'>${file}<\/li>`
    );
  }
}
export const projectUtils = {
  getInProject(file: string): string {
    return curProj[file];
  }
};
function parseScript(script: string, fs) {
  return `
(function() {
var module = {exports: {}};
var exports = new Proxy(module.exports, {})
${script}
return module;
})()
`
    .replace(/require\((?:'|")(.*?)(?:'|")\)/g, (all, fname) => {
      return fs.hasOwnProperty(fname)
        ? parseScript(compileScript(fs[fname], fname), fs) + ".exports"
        : fs.hasOwnProperty(name + ".js")
        ? parseScript(compileScript(fs[fname + ".js"], fname), fs) + ".exports"
        : parseScript(compileScript(getSync(NPMPackageList.resolve(fname, 'jsdelivr').resolved).text(), fname), fs) + ".exports"
    })
    .replace("$MAKERBUILD_PROJECT", "(" + JSON.stringify(curProj) + ")");
}
function getBundle() {
  let bundleBlob = new Blob(
    [
      curProj["index.html"].replace(
        /<script src=(?:'|")\.\/(.*?)(?:'|")><\/script>/g,
        (all, source) => {
          return `<script>${parseScript(
            compileScript(curProj[source], source),
            curProj
          )}<\/script>`;
        }
      )
    ],
    { type: "text/html" }
  );
  return URL.createObjectURL(bundleBlob);
}
export var deleteF = async () => {
  var fName = await prompt("File to Delete:");
  delete curProj[fName];
  reloadTree();
};
export var changeTheme = async () => {
  theme = await prompt("Theme:");
  editor.setTheme(`ace/theme/${theme}`);
};
document.body.onkeypress = function(e) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    // it's a command
    switch (e.key) {
      case "s": // Ctrl+S - save
        save();
        break;
      case "n": // Ctrl+N - new
        newF();
        break;
    }
  }
};
export function downloadBundle() {
  downloadFile(getBundle(), JSON.parse(curProj["project.json"]).name + ".html");
}
function downloadFile(sUrl: string, fileName: string) {
  //If in Chrome or Safari - download via virtual link click
  if (downloadFile.isChrome || downloadFile.isSafari) {
    //Creating new link node.
    var link = document.createElement("a");
    link.href = sUrl;

    if (link.download !== undefined) {
      //Set HTML5 download attribute. This will prevent file from opening if supported.
      //var fileName = sUrl.substring(sUrl.lastIndexOf("/") + 1, sUrl.length);
      link.download = fileName;
    }

    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      link.dispatchEvent(e);
      return true;
    }
  }

  // Force file download (whether supported by server).
  var query = "?download";

  window.open(sUrl + query);
}
namespace downloadFile {
    export var isChrome: boolean = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    export var isSafari: boolean = navigator.userAgent.toLowerCase().indexOf("safari") > -1;
}
export {downloadFile};

function compileScript(code: string, name: string): string {
  let parts = name.split(".");
  let ext = parts[parts.length - 1];
  let res: string = code;
  switch (ext) {
    case "js":
      res = Babel.transform(code, { presets: ["es2015"]}).code;
      break;
    case "ts":
    case "tsx":
      res = ts.transpile(code, {jsx: "react"}, name);
      break;
  }
  return res;
}
export async function addPackage() {
  let pkg = await prompt('Package Name:');
  npmPackages.install(pkg);
}
export async function removePackage() {
  let pkg = await prompt('Package Name:');
  npmPackages.uninstall(pkg);
}
(global as MBGlobal).makerbuild = __webpack_exports__;
