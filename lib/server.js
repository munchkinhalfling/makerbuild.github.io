'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use(_express2.default.static('docs'));
app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(_fs2.default.readFileSync('index.html'));
});
app.get(/.*/, function (req, res) {
    console.log(req.url);
});
app.listen(80, function () {
    console.log("Listening on http://makerbuild.io");
});