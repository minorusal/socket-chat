// index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { escucharSockets } = require('./utils/server');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// Llamar a la función para manejar la conexión
escucharSockets(io);

const PORT = process.env.PORT || 3008;
server.listen(PORT, () => {
  console.log(`Servidor de sockets escuchando en el puerto ${PORT}`);
});
