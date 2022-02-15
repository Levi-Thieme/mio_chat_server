import dotenv from 'dotenv'
dotenv.config()
import express, { Application, Request, Response, Router } from "express";
import path from "path";
import accountRoutes from "./routes/account"
import homeRoutes from "./routes/home";
import chatRoutes from "./routes/chat";
import { Server } from 'http';
import MessageServer from './messaging/messageServer';


const PORT = process.env.PORT || 3000;

const app: Application = express()
  .use(express.static(path.join(__dirname, './public/views')))
  .use(express.static(path.join(__dirname, './public/styles')))
  .use(express.static(path.join(__dirname, './public/scripts/lib')))
  .use(express.static(path.join(__dirname, './public/scripts/ui')))
  .use(express.static(path.join(__dirname, './public/imgs')))
  .use(express.json())
  .use("/", accountRoutes)
  .use("/", homeRoutes)
  .use("/", chatRoutes);

const server: Server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const messagingServer = new MessageServer(server);
messagingServer.listen();