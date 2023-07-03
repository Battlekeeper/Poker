import { defineNuxtModule } from '@nuxt/kit'
import { Server } from 'socket.io'
const { instrument } = require("@socket.io/admin-ui");

export default defineNuxtModule({
    setup(options, nuxt) {
        
        nuxt.hook('listen', (server) => {
            console.log('Socket listen', server.address(), server.eventNames())

            const io = new Server(server,  {
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

            io.on('connection', (socket) => {
                console.log('Connection', socket.id)
            })

            io.on('connect', (socket) => {
                //socket.emit('message', `welcome ${socket.id}`)
                //socket.broadcast.emit('message', `${socket.id} joined`)

                socket.on('message', function message(data: any) {
                    socket.emit('message', random())
                })

                socket.on('disconnecting', () => {
                    //socket.broadcast.emit('message', `${socket.id} left`)
                })
            })
        })
    },
})

function random() {
    return Math.random();
}