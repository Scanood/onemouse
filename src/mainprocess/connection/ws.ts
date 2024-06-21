import { Server } from "socket.io";
import { Server as S, Client as C, Connection, ServerVideo, ClientVideo } from './types'
function CreateIO() {
    this.instance = undefined
}
CreateIO.cleanInstance = function () {
    this.instance = undefined
}
CreateIO.getInstance = function (port = 9527, password = 1234): Server {
    if (!this.instance) {
        const io = new Server({
            path: "/",
            cors: {
                origin: "*"
            }
        })

        io.use((socket, next) => {
            const psd = socket.handshake.auth.password
            if (psd != password) {
                const error = new Error('invalid token')
                next(error)
            }
            next()
        })
        io.listen(port)
        this.instance = io
    }
    return this.instance
}

function CreateWS(port: number, password: number) {
    const io = CreateIO.getInstance(port, password)
    io.on('connection', (socket) => {

        io.emit(Connection.NEW)
        console.log(`A new client connected!`, socket.connected);
        // datachannel
        socket.on(C.OFFER, (args) => {
            console.log(`Transfer ${C.OFFER}`);
            socket.broadcast.emit(C.OFFER, args)
        })

        socket.on(C.ANSWER, (args) => {
            console.log(`Transfer ${C.ANSWER}`);
            socket.broadcast.emit(C.ANSWER, args)
        })

        socket.on(C.CANDIDATE, (args) => {
            console.log(`Transfer ${C.CANDIDATE}`);
            socket.broadcast.emit(C.CANDIDATE, args)
        })

        socket.on(S.ANSWER, (args) => {
            console.log(`Transfer ${S.ANSWER}`);
            socket.broadcast.emit(S.ANSWER, args)
        })

        socket.on(S.OFFER, (args) => {
            console.log(`Transfer ${S.OFFER}`);
            socket.broadcast.emit(S.OFFER, args)
        })

        socket.on(S.CANDIDATE, (args) => {
            console.log(`Transfer ${S.CANDIDATE}`);
            socket.broadcast.emit(S.CANDIDATE, args)
        })
        // screen
        socket.on(ClientVideo.OFFER, (args) => {
            console.log(`Transfer ${ClientVideo.OFFER}`);
            socket.broadcast.emit(ClientVideo.OFFER, args)
        })

        socket.on(ClientVideo.ANSWER, (args) => {
            console.log(`Transfer ${ClientVideo.ANSWER}`);
            socket.broadcast.emit(ClientVideo.ANSWER, args)
        })

        socket.on(ClientVideo.CANDIDATE, (args) => {
            console.log(`Transfer ${ClientVideo.CANDIDATE}`);
            socket.broadcast.emit(ClientVideo.CANDIDATE, args)
        })

        socket.on(ServerVideo.ANSWER, (args) => {
            console.log(`Transfer ${ServerVideo.ANSWER}`);
            socket.broadcast.emit(ServerVideo.ANSWER, args)
        })

        socket.on(ServerVideo.OFFER, (args) => {
            console.log(`Transfer ${ServerVideo.OFFER}`);
            socket.broadcast.emit(ServerVideo.OFFER, args)
        })

        socket.on(ServerVideo.CANDIDATE, (args) => {
            console.log(`Transfer ${ServerVideo.CANDIDATE}`);
            socket.broadcast.emit(ServerVideo.CANDIDATE, args)
        })
    })
}

function StopWS() {
    CreateIO.getInstance()?.close()
    CreateIO.cleanInstance()
}

export {
    CreateWS,
    StopWS
}
