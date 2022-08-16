//CALL MODULES
import 'dotenv/config';
import express from "express";
import { Server as SocketIo} from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { socketsEvents } from './server/sockets.js';
import morgan from "morgan";

//INITIALIZATIONS
const app = express();
const server = http.createServer(app); //nuevo
const io = new SocketIo(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//SETTINGS
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));

//STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//WEB SOCKETS
socketsEvents(io);

//SERVER
server.listen(app.get('port'), () => {
    console.log('Server on Port:', app.get('port'));
});