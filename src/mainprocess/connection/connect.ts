import { CreateIOClient } from './socket'
import { createClientRTC, createClientVideoRTC, createServerRTC, createServerVideoRTC } from './rtc'
import { Connection } from './types'
import { usePeerStore } from '../../store/index'
import { storeToRefs } from 'pinia'
// datachannel
// client is offerer side,server is answerer side
function ServerConnect(host_name: string, port: number, password: number, onmessage: (event: MessageEvent) => void) {
    const io = CreateIOClient(host_name, port, password)
    const store = usePeerStore()
    io.on(Connection.NEW, () => {
        console.log(`A client connected!`);
        const { ServerPeer } = storeToRefs(store)
        if (!ServerPeer.value) {
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
        ordered: true,
    })
    return { channel: dataChannel, peer: rtc }
}


// screen
function ServerVideoConnect(host_name: string, port: number, password: number) {
    const io = CreateIOClient(host_name, port, password)
    const rtc = createServerVideoRTC(io)
    const store = usePeerStore()
    store.updateServerVideoPeer(rtc)
    console.log('video::Server Create video RTC!');
    return rtc
}


function ClientVideoConnect(host_name: string, port: number, password: number) {
    const io = CreateIOClient(host_name, port, password)
    const rtc = createClientVideoRTC(io)
    console.log('video::Client Create video RTC!');
    return rtc
}

function CloseSocketIO() {
    const store = usePeerStore()
    if (store.ClientSocket) {
        store.updateClientSocket(undefined)
        store.ClientPeer?.close()
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