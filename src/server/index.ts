import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { CharacterDataType, TurnType } from "../types.ts";
import { initializeGame, samplePlayers } from "./gameData.ts";
import { resolveTurn } from "./actions.ts";

const port = 8080;
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:"http://localhost:5173"
    }
});

io.on("connection", (socket) => {
    let characterData: CharacterDataType = initializeGame(samplePlayers);

    function updateGameState() {
        io.emit("update_game_state", characterData);
    }

    socket.on("load_new_game", updateGameState);

    socket.on("turn", (turn: TurnType) => {
        characterData = resolveTurn(turn, characterData);
        updateGameState();
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