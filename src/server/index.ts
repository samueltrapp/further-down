import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
// import { CharacterDataType, TurnType } from "../types.ts";
import { initializeGame } from "./gameData.ts";
// import { resolveTurn } from "./actions.ts";
import { v4 as uuidv4 } from 'uuid';
import { GameMetaType } from "../types.ts";

const port = 8080;
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:"http://localhost:5173"
    }
});

const gameMeta: GameMetaType = {
    games: [],
    findGame(gameId: string) {
        return this?.games?.find((game) => game.gameId === gameId)
    }
};

io.on("connection", (socket) => {
    function createGame() {
        const newGameId = uuidv4();
        gameMeta.games.push(initializeGame(newGameId));
        retrieveGame(newGameId);
    }

    function retrieveGame(gameId: string) {
        const selectedGame = gameMeta.findGame(gameId);
        console.log(selectedGame);
        io.emit("update", selectedGame);
    }

    socket.on("create", createGame);
    socket.on("load", (gameId) => retrieveGame(gameId));
    // socket.on("turn", (turn: TurnType) => {
    //      = resolveTurn(turn, gameMeta);
    // });
});

server.on("error", (e) => {
    console.error(e);
});

server.listen(port, () => {
    console.log(`Ready at ${port}`);
});