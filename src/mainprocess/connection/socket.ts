import { Manager, Socket } from "socket.io-client";

declare global {
    interface Window {
        socket: Socket
    }
}

function CreateIOClient(host_name = "192.168.1.1", port = 9527, password: number) {
    const manage = new Manager(`${host_name}:${port}`, {
        transports: ["websocket", "polling"]
    })
    const socket = manage.socket(`/`, {
        auth: {
            password
        }
    })

    console.log(`client socket io is running!`);

    window.socket = socket
    return socket
}

export {
    CreateIOClient
}