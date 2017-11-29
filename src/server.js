import express from 'express';
import fs from 'fs';
var app = express();
app.use(express.static('docs'));
app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('index.html'));
});
app.get(/.*/, (req, res) => {console.log(req.url);});
app.listen(80, () => {
    console.log("Listening on http://makerbuild.io");
});