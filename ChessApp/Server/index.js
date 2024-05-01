// Note That I Got Starter Code/Planning From Socket.io Documentation Tutorial
// That Documentation Can Be Found Here https://socket.io/docs/v4/tutorial/introduction
// Documentation For ExpressJS Can Be Found Here https://expressjs.com/en/starter/installing.html
// Documentation For ChessboardJS Can Be Found Here https://chessboardjs.com/
// Nodemon (Used For Automatically Restart Server Upon Change) Documentation https://www.npmjs.com/package/nodemon
// Not Sure Why I Need Nodemon, But It Was Recommended In Documentation
// Documentation For Cors (Troubleshoots Issues For Socket.io) https://www.npmjs.com/package/cors

 // I'm Using The Legacy Method To Import These Because I Don't Know If ChessboardJS Supports ESM Syntax And Don't Want Any Issues Later
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Initialize Socket.io Server
const app = express();
const server = http.createServer(app);
const io = new Server(server, 
{
    cors: 
    {
        // Get The Requests From Node.js (Runs On Port 3000)
        origin: "http://localhost:3000"
    }
});

// Detect If Someone has Connected To Server. Acts Like An Event Listener
io.on("connection", (socket) =>
{
    // Handle Connections
    console.log(`User Connected. ID: ${socket.id}`);

    // Handle A Player Attempting To Join A Room
    socket.on("join", (playerName, roomCode) =>
    {
        socket.join(roomCode);
        console.log(`${playerName} joined Room: ${roomCode}`);
        
    })

    socket.on("sendMsg", (msgData) =>
    {
        socket.to(msgData.room).emit("recieveMsg", msgData);
    })

    // Handle Disconnection
    socket.on("disconnect", () =>
    {
        console.log(`User Disconnected. ID: ${socket.id}`);
    });
})

// Setup Cors (Recommended For Troubleshooting)
const cors = require("cors");
app.use(cors());

// Listen To A Specific Port (Use 3001 Because React Uses Port 3000 By Default), Value Really Doesnt Matter As Long As We Know It
server.listen(3001, () =>
{
    console.log('Server is currently running at http://localhost:3001');
})
