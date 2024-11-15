// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your frontend origin if different
        methods: ['GET', 'POST'],
    },
});

// Serve static files (PDF file, frontend build, etc.)
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('pageChange', (newPage) => {
        socket.broadcast.emit('pageChange', newPage); // Broadcast the page change to all other clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
