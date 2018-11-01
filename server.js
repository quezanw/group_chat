var express = require('express');
var session = require('express-session');
var path = require("path");
var app = express();
const server = app.listen(8000)
const io = require('socket.io')(server);

var users = {};
io.on('connection', function (socket) {
  let user_id = socket.id;

  socket.emit('connected', {
    msg: 'You have been connected to the server'
  })

  socket.on("user_connected", function (data) {
    console.log(data.msg);
  })

  socket.on("new_user_connected", function (data) {
    // console.log("data: "+ data.new_user_name)
    users[user_id] = data.new_user_name;

    // broadcasts to everyone except the new user that someone has connected
    socket.broadcast.emit("new_user", {
      name: data.new_user_name
    });

    // emits data back to the new user who has connected
    socket.emit("display_all", {
      users: users
    });

  });

  // emits an event when a user disconnects 
  socket.on("disconnect", function () {
    let data = {
      name: users[user_id]
    }
    delete users[user_id];
    data.users = users;
    socket.broadcast.emit("user_disconnected", data)
  });

  socket.on("message_posted", function (data) {
    io.emit("post_new_message", {
      msg: data.msg,
      user_name: users[user_id]
    })
  });

});

// add static content
app.use(express.static(path.join(__dirname, "./static")));

app.get('/', function (request, response) {
  response.render("index");
});