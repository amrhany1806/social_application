import express from "express";
import { bootstrap } from "./app.controller";
import { Server } from "socket.io";
import { config } from "dotenv";
import { initSocket } from "./socket-io";
config();
const app = express();
const port = 3000;
bootstrap(app, express);
const server = app.listen(port, () => {
    console.log("Server is running on port", port);
});


initSocket(server);
