# MakerBuild-IDE
An IDE for web programming
----------------------------------------
## Getting Started
To launch MakerBuild, open the [MakerBuild Launcher](munchkinhalfling.github.io/MakerBuild-IDE).
Please disable your popup blocker, because the MakerBuild IDE is a popup.
To make a new project, hit the 'New Project' button.
It will create index.html, app.js, and project.json files in the project.
To save, hit Ctrl+S. To create a new file, hit Ctrl+N.
To preview your page in a dialog, go to "view" > "Preview". This will launch a modal.
## Coding Querks
Since I had to write the script-loading engine myself, there are a few querks. I had to write it myself because the project is stored in a JSON object, not a directory.
### The First Querk
First up is with the <script> tag. As with any method of importing scripts (in the IDE), you have to have a "./" in front of all local URLs.
### The Second Querk
Second up is with export statements. You can only "export default".
### The Third Querk
Third up is with import statements. This relates to the the second querk. Since you can only use default exports, the `import {var1, var2} from './module.js'` syntax imports properties of an object you 'export default'.
