## Getting Started
To launch MakerBuild, <button class="btn btn-primary" onclick="openIde()">Click this button</button>.
Please disable your popup blocker, because the MakerBuild IDE is a popup.
To make a new project, hit the 'New Project' button.
It will create index.html, app.js, and project.json files in the project.
To save, hit Ctrl+S. To create a new file, hit Ctrl+N.
To preview your page in a dialog, go to "view" > "Preview". This will launch a modal.
## Coding Quirks
Since I had to write the script-loading engine myself, there are a few quirks. I had to write it myself because the project is stored in a JSON object, not a directory.
### The First Quirk
First up is with the <script> tag. As with any method of importing scripts (in the IDE), you have to have a "./" in front of all local URLs.
### The Second Quirk
Second up is with export statements. You can only "export default".
### The Third Quirk
Third up is with import statements. This relates to the the second querk. Since you can only use default exports, the `import {var1, var2} from './module.js'` syntax imports properties of an object you 'export default'.

## Browser Support
The app is tried, true, and tested in Firefox Developer Edition, although I do believe that that is the only browser it really works in. Chrome doesn't work, that's for sure (at least keyboard shortcuts, URL hiding in the dialog, and the preview don't work in Chrome).
