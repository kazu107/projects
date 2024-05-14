'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require("path");

const PORT = process.env.PORT || 5001;

const server = express()
    .use(express.static('public'))
    .get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    })
    .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);