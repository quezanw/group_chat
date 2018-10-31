var express = require('express');
var session = require('express-session');
var path = require("path");
var app = express();
const server = app.listen(8000)
const io = require('socket.io')(server);


io.on('connection', function(socket) {
    socket.emit('connected', { msg: 'You have been connected to the server' })

    socket.on("user_connected", function (data) {
        console.log(data.msg);
    })

});

// add static content
app.use(express.static(path.join(__dirname, "./static")));

app.get('/', function (request, response) {
    response.render("index");
});