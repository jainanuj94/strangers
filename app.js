import express from "express";
import http from "http";
import {Server} from "socket.io";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server);

let connectedPeers = [];
let connectedPeersStrangers = [];
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  connectedPeers.push(socket.id);

  socket.on('pre-offer', (data)=> {
    const { callType, calleePersonalCode } = data;
    const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === calleePersonalCode);
    if (connectedPeer){
      const data = {
        callerSocketId: socket.id,
        callType: callType
      }
      io.to(calleePersonalCode).emit("pre-offer", data)
    } else {
      const payload = {preOfferAnswer: "CALLEE_NOT_FOUND"}
      io.to(socket.id).emit("pre-offer-answer", payload)
    }
  });

  socket.on("pre-offer-answer", (data) => {
    const { callerSocketId } = data;
    const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === callerSocketId);
    if (connectedPeer){
      io.to(callerSocketId).emit("pre-offer-answer", data);
    }
  });

  socket.on("webRTC-signaling", (data) => {
    const { connectedUserSocketId} = data;
    const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === connectedUserSocketId);
    if (connectedPeer){
      io.to(connectedUserSocketId).emit("webRTC-signaling", data);
    }
  })

  socket.on("user-hanged-up", (data) => {
    const { connectedUserSocketId} = data;
    const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === connectedUserSocketId);

    if (connectedPeer){
      io.to(connectedUserSocketId).emit("user-hanged-up");
    }
  })

  socket.on("stranger-connection-status", (data) => {
    const { status } = data;

    if (status){
      connectedPeersStrangers.push(socket.id);
    }else{
      connectedPeersStrangers = connectedPeersStrangers.filter((p) => p !== socket.id);
    }
  })

  socket.on("get-stranger-socket-id", () => {
    let randomStrangerSocketId;
    const availableSocketIds = connectedPeersStrangers.filter((peer) => peer !== socket.id);

    if (availableSocketIds.length > 0){
      randomStrangerSocketId = availableSocketIds[Math.floor(Math.random() * availableSocketIds.length)];
    } else {
      randomStrangerSocketId = null;
    }

    const data = {
      randomStrangerSocketId
    }

    io.to(socket.id).emit("stranger-socket-id", data);
  })

  socket.on("disconnect", () => {
    connectedPeers = connectedPeers.filter((peer) => peer !== socket.id);
    connectedPeersStrangers = connectedPeersStrangers.filter((peer) => peer !== socket.id)
    console.log("user disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});