const express = require("express")
const app = express()

const server = require("http").createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    socket.on("chat", (payload) => {
        io.emit("chat", payload)
    })
})

server.listen(8080, () => {
    console.log("listening on port 8080...")
})