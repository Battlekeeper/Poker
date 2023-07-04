import { defineNuxtModule } from '@nuxt/kit'
import { Server } from 'socket.io'
import {ChatHandlers} from "./chat"

const { instrument } = require("@socket.io/admin-ui");

export var io:Server

export default defineNuxtModule({
    setup(options, nuxt) {
        
        nuxt.hook('listen', (server) => {
            console.log('Socket listen', server.address(), server.eventNames())

            io = new Server(server,  {
                cors: {
                    origin: ["https://admin.socket.io"],
                    credentials: true
                  }
            })
            //https://admin.socket.io/#/
            instrument(io, {
                auth: {
                  type: "basic",
                  username: "admin",
                  password: "$2a$12$QhnvivG8actfqZaISb2Hs.DPAaej/gDuYsMN/ZKUthn1SRkbqiFPq" // "password" encrypted with bcrypt (https://bcrypt-generator.com/)
                },
              });

            nuxt.hook('close', () => io.close())

            io.of("/random").on('connect', (socket) => {
                socket.on('message', function message(data: any) {
                    socket.emit('message', Math.random())
                })
            })
            ChatHandlers(io)
        })

    }
})