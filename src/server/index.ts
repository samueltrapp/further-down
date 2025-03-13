import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";

// Initializations
const port = 8080;
const app = express();

app.use(cors());

let x = 100;

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin:"http://localhost:5173"
    }
});

io.on("connection", socket => {
    console.log("OK");
    function updateAll() {
        socket.emit("update", x);
    }

    socket.on("action", (hp: number) => {
        x -= hp;
        console.log(x);
        updateAll();
    });

    socket.on("disconnect", () => {
        console.log("Disconnected");
    });
});

server.on("error", (e) => {
    console.error(e);
});

server.listen(port, () => {
    console.log(`Ready at ${port}`);
});