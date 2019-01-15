import * as Babel from "babel-standalone";
interface JQModal extends JQuery {
  modal(thing: string): void;
}
interface MBGlobal extends NodeJS.Global {
  makerbuild: any;
}
var editor = ace.edit("editor");
var theme = "chrome";
var defaultProj = {
  "app.js": "// This is the main JavaScript file\n// Type code here."
};
var curProj = JSON.parse(localStorage["curProj"] || "{}");
var curFile;
var previewBlob;
var scriptBlobs = [];
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
$("#nproj").on("click", function(e) {
  var projName = prompt("Project Name:", "Untitled Project");
  $("#projName").text(projName);
  curProj = defaultProj;
  curProj["project.json"] = `{
    "name": "${projName}",
    "version": "1.0.0",
    "createdWith": "MakerBuild IDE"
}`;
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
export const newF = () => {
  var fileName = prompt("File name:", "unnamed.js");
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
        ? parseScript(
            Babel.transform(fs[fname], { presets: ["es2015"] }).code,
            fs
          ) + ".exports"
        : fs.hasOwnProperty(name + ".js")
        ? parseScript(
            Babel.transform(fs[name + ".js"], { presets: ["es2015"] }),
            fs
          ) + ".exports"
        : (() => {
            throw new Error("No module " + fname + " in project.");
          })();
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
            Babel.transform(curProj[source], {
              presets: ["es2015"]
            }).code,
            curProj
          )}<\/script>`;
        }
      )
    ],
    { type: "text/html" }
  );
  return URL.createObjectURL(bundleBlob);
}
export var deleteF = () => {
  var fName = prompt("File to Delete:");
  delete curProj[fName];
  reloadTree();
};
export var changeTheme = () => {
  theme = prompt("Theme:");
  editor.setTheme(`ace/theme/${theme}`);
};
document.body.onkeypress = function(e) {
  if (e.ctrlKey || e.metaKey) {
    // it's a command
    switch (e.key) {
      case "s": // Ctrl+S - save
        save();
        e.preventDefault();
        break;
      case "n": // Ctrl+N - new
        newF();
        e.preventDefault();
        break;
    }
  }
};
export function downloadBundle() {
  downloadFile(getBundle(), JSON.parse(curProj["project.json"]).name + ".html");
}
export function downloadFile(sUrl: string, fileName: string) {
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

module.exports.downloadFile.isChrome =
  navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
module.exports.downloadFile.isSafari =
  navigator.userAgent.toLowerCase().indexOf("safari") > -1;
(<MBGlobal>global).makerbuild = module.exports;
