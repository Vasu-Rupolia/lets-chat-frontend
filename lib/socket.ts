import { io, Socket } from "socket.io-client";

const socket: Socket = io("https://api.skillbarter.codevocab.com");

export default socket;