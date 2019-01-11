/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var editor = ace.edit(\"editor\");\r\nvar theme = \"chrome\";\r\nvar defaultProj = {\r\n  \"app.js\": \"// This is the main JavaScript file\\n// Type code here.\"\r\n};\r\nvar curProj = JSON.parse(localStorage[\"curProj\"] || \"{}\");\r\nvar curFile;\r\nvar previewBlob;\r\nvar scriptBlobs = [];\r\n$.get(\"template_index.html\", (data, status, xhr) => {\r\n  defaultProj[\"index.html\"] = data;\r\n});\r\nreloadTree();\r\neditor.setTheme(`ace/theme/${theme}`);\r\neditor.getSession().setMode(\"ace/mode/javascript\");\r\n// DOWN and DIRTY NOW //\r\n$(\"#nproj\").on(\"click\", function(e) {\r\n  var projName = prompt(\"Project Name:\", \"Untitled Project\");\r\n  $(\"#projName\").text(projName);\r\n  curProj = defaultProj;\r\n  curProj[\"project.json\"] = `{\r\n    \"name\": \"${projName}\",\r\n    \"version\": \"1.0.0\",\r\n    \"createdWith\": \"MakerBuild IDE\"\r\n}`;\r\n  reloadTree();\r\n});\r\nfunction openFile(e) {\r\n  editor.setValue(curProj[e.target.textContent]);\r\n  curFile = e.target.textContent;\r\n  switch (e.target.textContent.split(\".\")[1]) {\r\n    case \"js\":\r\n      editor.getSession().setMode(\"ace/mode/javascript\");\r\n      break;\r\n    case \"html\":\r\n      editor.getSession().setMode(\"ace/mode/html\");\r\n      break;\r\n    default:\r\n      break; // Ace usually auto-detects the file type //\r\n  }\r\n}\r\nfunction save() {\r\n  curProj[curFile] = editor.getValue();\r\n  localStorage[\"curProj\"] = JSON.stringify(curProj);\r\n  alert(\"Saved!\");\r\n}\r\nfunction newF() {\r\n  var fileName = prompt(\"File name:\", \"unnamed.js\");\r\n  var fileContents;\r\n  switch (fileName.split(\".\")[1]) {\r\n    case \"html\":\r\n      $.get(\"template_generic.html\", (data, status, xhr) => {\r\n        fileContents = data;\r\n      });\r\n      break;\r\n    case \"js\":\r\n      fileContents = \"// This is a new file.\";\r\n      break;\r\n    default:\r\n      fileContents = \"\";\r\n      break;\r\n  }\r\n  curProj[fileName] = fileContents;\r\n  reloadTree();\r\n}\r\nfunction preview() {\r\n  scriptBlobs = {};\r\n  previewBlob = new Blob(\r\n    [\r\n      curProj[\"index.html\"].replace(\r\n        /<script src=(?:'|\")\\.\\/(.*?)(?:'|\")><\\/script>/g,\r\n        (all, source) => {\r\n          scriptBlobs[source] = new Blob(\r\n            [\r\n              Babel.transform(parseScript(curProj[source]), {\r\n                presets: [\"es2015\"]\r\n              }).code\r\n            ],\r\n            { type: \"text/javascript\" }\r\n          );\r\n          return `<script src=\"${URL.createObjectURL(\r\n            scriptBlobs[source]\r\n          )}\"><\\/script>`;\r\n        }\r\n      )\r\n    ],\r\n    { type: \"text/html\" }\r\n  );\r\n  var blobURL = URL.createObjectURL(previewBlob);\r\n  $(\"#previewIframe\").attr(\"src\", blobURL);\r\n  $(\"#previewModalTitle\").text(\r\n    document.querySelector(\"#previewIframe\").contentDocument.title\r\n  );\r\n  $(\"#previewModal\").modal(\"show\");\r\n}\r\nfunction reloadTree() {\r\n  $(\"#fileTree\").html(\"\");\r\n  $(\"#projName\").html(\r\n    JSON.parse(\r\n      curProj && \"project.json\" in curProj\r\n        ? curProj[\"project.json\"]\r\n        : '{\"name\": \"<No Project>\"}'\r\n    ).name\r\n  );\r\n  $(\"title\").html(\r\n    \"MakerBuild IDE - \" +\r\n      JSON.parse(\r\n        curProj && \"project.json\" in curProj\r\n          ? curProj[\"project.json\"]\r\n          : '{\"name\": \"<No Project>\"}'\r\n      ).name\r\n  );\r\n  for (let file in curProj) {\r\n    $(\"#fileTree\").append(`<li onclick='openFile(event)'>${file}<\\/li>`);\r\n  }\r\n}\r\nfunction parseScript(script) {\r\n  return (\r\n    \"var __namedExports = {}; var __default = null;\" +\r\n    script\r\n      .replace(\r\n        /import {(.*?)} from \"\\.\\/(.*?)\";/g,\r\n        (all, things, source) =>\r\n          `var {${things}} = ((() => {${parseScript(\r\n            curProj[source]\r\n          )}})()).__namedExports;`\r\n      )\r\n      .replace(\r\n        /import (.*?) from \"\\.\\/(.*?)\";/g,\r\n        (all, things, source) =>\r\n          `var ${things} = ((() => {${parseScript(\r\n            curProj[source]\r\n          )}})()).__default;`\r\n      )\r\n      .replace(/export default (.*?);/, \"__default = $1;\")\r\n      .replace(/export var (.*)/, 'var $1 = __namedExports[\"$1\"]')\r\n      .replace(\r\n        /export function (.*?)\\(/,\r\n        ' var $1 = __namedExports[\"$1\"] = function ('\r\n      )\r\n      .replace(\r\n        /export class (.*)/,\r\n        'var $1 = __namedExports[\"$1\"] = class $1'\r\n      ) +\r\n    (script.indexOf(\"@module\") > -1\r\n      ? \"\\nreturn { __namedExports, __default };\\n\"\r\n      : \"\")\r\n  );\r\n}\r\nfunction deleteF() {\r\n  var fName = prompt(\"File to Delete:\");\r\n  delete curProj[fName];\r\n  reloadTree();\r\n}\r\nfunction changeTheme() {\r\n  theme = prompt(\"Theme:\");\r\n  editor.setTheme(`ace/theme/${theme}`);\r\n}\r\ndocument.body.onkeypress = function(e) {\r\n  if (e.ctrlKey || e.metaKey) {\r\n    // it's a command\r\n    switch (e.key) {\r\n      case \"s\": // Ctrl+S - save\r\n        save();\r\n        e.preventDefault();\r\n        break;\r\n      case \"n\": // Ctrl+N - new\r\n        newF();\r\n        e.preventDefault();\r\n        break;\r\n    }\r\n  }\r\n};\r\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });