const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const Port = 8000
const io = new Server({
    cors: true
});
const app = express();
app.use(bodyParser.json());
const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();
io.on("connection", (socket) => {
    console.log("New connection");
    socket.on("join-room", (data) => {
        const { roomId, emailId } = data;
        console.log("User", emailId, "Joined Room", roomId);
        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId);
        socket.join(roomId);
        socket.emit("joined-room", { roomId });
        socket.broadcast.to(roomId).emit("user-joined", { emailId });
    });
    socket.on('call-user', data => {
        const { emailId, offer } = data;
        const fromEmail = socketToEmailMapping.get(socket.id);
        const sockeId = emailToSocketMapping.get(emailId);
        socket.to(sockeId).emit('incomming-call', { from: fromEmail, offer });
    });
    socket.on('call-accepted', data => {
        const { emailId, ans } = data;
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit('call-accepted', { ans });
    })
});
app.listen(Port, () => { console.log(`http server running at Port : ${Port}`) });
io.listen(8001);