const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
    ]
}

import { Socket } from 'socket.io-client'
import { Server, Client, Connection, ServerVideo, ClientVideo } from './types'
import { usePeerStore } from '../../store/index'
import { e } from '../../utils/event'
function createClientRTC(io: Socket): RTCPeerConnection {

    const rtc = new RTCPeerConnection(config)

    rtc.onconnectionstatechange = () => {
        if (rtc.connectionState === 'disconnected') {
            e.emit('serverRTC-disconnect')
        }
    }

    rtc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            io.emit(Client.CANDIDATE, candidate)
        }
    }

    io.on(Server.CANDIDATE, (args) => {
        console.log('Client accept Server candidate!');
        rtc.addIceCandidate(args)
    })

    io.on(Server.ANSWER, (args) => {
        rtc.setRemoteDescription(args)
    })

    io.on(Connection.NEW, () => {
        if (rtc.connectionState === 'connected') return
        console.log(`New client connected!`);
        rtc.createOffer().then((offer) => {
            rtc.setLocalDescription(offer)
            io.emit(Client.OFFER, offer)
        })
    })

    // onnegotiationneeded
    io.on(Server.OFFER, (args) => {
        console.log('Client accept Server Offer!');
        rtc.setRemoteDescription(args)
        rtc.createAnswer().then((answer) => {
            rtc.setLocalDescription(answer)
            io.emit(Client.ANSWER, answer)
        })
    })

    io.on('connect_error', (error) => {
        if (error.message == 'invalid token') {
            e.emit('socket-error')
        }
    })

    return rtc
}

function createServerRTC(io: Socket, onmessage: (event: MessageEvent) => void): RTCPeerConnection {
    const rtc = new RTCPeerConnection(config)

    rtc.onconnectionstatechange = () => {
        if (rtc.connectionState === 'disconnected') {
            io.removeAllListeners(Client.ANSWER)
            io.removeAllListeners(Client.OFFER)
            io.removeAllListeners(Client.CANDIDATE)
            const store = usePeerStore()
            store.updateServerPeer(undefined)
            rtc.close()
        }
    }

    rtc.ondatachannel = (event) => {
        const channel = event.channel
        channel.onmessage = onmessage
    }

    rtc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            io.emit(Server.CANDIDATE, candidate)
        }
    }

    io.on(Client.CANDIDATE, (args) => {
        console.log('Server accept client candidate!');
        rtc.addIceCandidate(args)
    })

    io.on(Client.OFFER, (args) => {
        console.log('Server accept client offer!');
        rtc.setRemoteDescription(args)
        rtc.createAnswer().then((answer) => {
            rtc.setLocalDescription(answer)
            io.emit(Server.ANSWER, answer)
        })
    })

    // onnegotiationneeded
    rtc.onnegotiationneeded = () => {
        console.log(`onnegotiationneeded`);
        rtc.createOffer().then((offer) => {
            rtc.setLocalDescription(offer)
            io.emit(Server.OFFER, offer)
        })
    }

    io.on(Client.ANSWER, (args) => {
        console.log('Server accept client Answer!');
        rtc.setRemoteDescription(args)
    })

    return rtc
}

// screen
function createClientVideoRTC(io: Socket): RTCPeerConnection {
    const rtc = new RTCPeerConnection(config)

    rtc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            io.emit(ClientVideo.CANDIDATE, candidate)
        }
    }

    io.on(ServerVideo.CANDIDATE, (args) => {
        console.log('video::Client accept Server candidate!');
        rtc.addIceCandidate(args)
    })

    io.on(ServerVideo.OFFER, (args) => {
        console.log('video::Client accept Server offer!');
        rtc.setRemoteDescription(args)
        rtc.createAnswer().then((answer) => {
            rtc.setLocalDescription(answer)
            io.emit(ClientVideo.ANSWER, answer)
        })
    })

    return rtc
}

function createServerVideoRTC(io: Socket): RTCPeerConnection {
    const rtc = new RTCPeerConnection(config)

    rtc.onconnectionstatechange = () => {
        if (rtc.connectionState === 'disconnected') {
            io.removeAllListeners(ServerVideo.OFFER)
            io.removeAllListeners(ServerVideo.ANSWER)
            io.removeAllListeners(ServerVideo.CANDIDATE)
            io.removeAllListeners(Connection.NEW)
            const store = usePeerStore()
            store.updateServerVideoPeer(undefined)
            io.disconnect()
            io.close()
            rtc.close()
        }
    }

    rtc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            io.emit(ServerVideo.CANDIDATE, candidate)
        }
    }

    io.on(ClientVideo.CANDIDATE, (args) => {
        console.log('video::Server accept Client candidate!');
        rtc.addIceCandidate(args)
    })

    io.on(ClientVideo.ANSWER, (args) => {
        rtc.setRemoteDescription(args)
    })

    io.on(Connection.NEW, () => {
        console.log(`video::New client connected!`);
        rtc.createOffer().then((offer) => {
            rtc.setLocalDescription(offer)
            io.emit(ServerVideo.OFFER, offer)
        })
    })

    // onnegotiationneeded
    rtc.onnegotiationneeded = () => {
        console.log(`video::onnegotiationneeded`);
        rtc.createOffer().then((offer) => {
            rtc.setLocalDescription(offer)
            io.emit(ServerVideo.OFFER, offer)
        })
    }

    return rtc
}

export {
    createClientRTC,
    createServerRTC,
    createClientVideoRTC,
    createServerVideoRTC
}