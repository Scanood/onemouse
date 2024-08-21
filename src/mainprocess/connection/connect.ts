import { CreateIOClient } from './socket'
import { createClientRTC, createClientVideoRTC, createServerRTC, createServerVideoRTC } from './rtc'
import { Connection } from './types'
import { usePeerStore } from '../../store/index'

// datachannel
// client is offerer side,server is answerer side
function ServerConnect(host_name: string, port: number, password: number, onmessage: (event: MessageEvent) => void) {
    const io = CreateIOClient(host_name, port, password)
    io.on(Connection.NEW, () => {
        // console.log(`A client connected!`);
        const store = usePeerStore()
        if (!store.ServerPeer) {
            console.log(`create Server RTC`);
            const rtc = createServerRTC(io, onmessage)
            store.updateServerPeer(rtc)
        }
    })
}

function ClientConnect(host_name: string, port: number, password: number) {
    const store = usePeerStore()
    const io = CreateIOClient(host_name, port, password)
    const rtc = createClientRTC(io)
    store.updateClientPeer(rtc)
    console.log('Client Create RTC!');
    const dataChannel = rtc.createDataChannel('mouse', {
        ordered: false,
    })
    return { channel: dataChannel, peer: rtc }
}


// screen
function ServerVideoConnect(host_name: string, port: number, password: number, onmessage: (event: MessageEvent) => void) {
    const io = CreateIOClient(host_name, port, password)
    io.on(Connection.NEW, () => {
        // console.log(`A videoclient connected!`);
        const store = usePeerStore()
        if (!store.ServerVideoPeer) {
            const rtc = createServerVideoRTC(io, onmessage)
            store.updateServerVideoPeer(rtc)
            console.log('video::Server Create video RTC!');
        }
    })
}


function ClientVideoConnect(host_name: string, port: number, password: number) {
    const io = CreateIOClient(host_name, port, password)
    const rtc = createClientVideoRTC(io)
    const dataChannel = rtc.createDataChannel('keyboard', {
        ordered: false,
    })
    console.log('video::Client Create video RTC!');
    return { channel: dataChannel, peer: rtc }
}

function CloseSocketIO() {
    const store = usePeerStore()
    if (store.ClientSocket.length > 0) {
        store.updateClientSocket(undefined)
        store.ClientPeer?.close()
        store.updateClientPeer(undefined)
        console.log('Client socket io closed!');
    }
}

export {
    ServerConnect,
    ClientConnect,
    CloseSocketIO,
    ServerVideoConnect,
    ClientVideoConnect
}