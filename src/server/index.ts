import * as http from "http";
import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import { Server } from "socket.io";

// Initializations
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 8080;
const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", client => {

    client.on("action", () => ({hp}: {"hp": number}) => {
        console.log(hp);
        io.emit("update", {hp});
    });
    client.on("disconnect", () => { console.log("Bye") });
});

server.on("error", (e) => {
    console.error(e);
});

server.listen(port, () => {
    console.log(`Ready at ${port}`);
});