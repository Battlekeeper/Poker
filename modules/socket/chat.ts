import { Server } from 'socket.io'

export function ChatHandlers(io:Server){
    io.of("/chat").on('connect', (socket) => {
        socket.on('JoinRoom', function message(roomId: any) {
            socket.join(roomId)
            //socket.broadcast.emit("ReciveMessage", `User ${socket.id} has joined the chat room`)
        })
        socket.on('SendMessage', function message(message: Message) {
            message.recivedMessage = true;
            socket.to(message.roomId).emit("ReciveMessage", message)
        })
    })
}
export class Message
{
    roomId: string;
    name: string;
    content: string;
    recivedMessage: boolean;
    constructor(name: string, content: string, recivedMessage: boolean, roomId:string) {
        this.name = name;
        this.content = content;
        this.recivedMessage = recivedMessage;
        this.roomId = roomId;
    }
}