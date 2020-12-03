
var express = require ('express')
port = 3000
var app = express();
app.listen(port, function () {
    console.log("Node server running on " +port);
});