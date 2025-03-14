import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { GameState } from "../types";
import { initialGameState } from "./gameState.js";

const port = 8080;
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:"http://localhost:5173"
    }
});

io.on("connection", socket => {
    const gameState: GameState = initialGameState;

    socket.on("get_game_state", () => {
        console.log("Retrieved game state");
        io.emit("update_game_state", gameState);
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