import { defineStore } from "pinia";
import { ref } from 'vue'
import { Socket } from "socket.io-client";
const usePeerStore = defineStore('peer', () => {

    const ServerPeer = ref<RTCPeerConnection>(undefined)
    const ClientPeer = ref<RTCPeerConnection>(undefined)
    const ServerVideoPeer = ref<RTCPeerConnection>(undefined)
    const ClientVideoPeer = ref<RTCPeerConnection>(undefined)
    // client socket
    const ClientSocket = ref<Socket>()


    function updateServerPeer(newPeer: RTCPeerConnection | undefined) {
        ServerPeer.value = newPeer
        // console.log(`store update ServerPeer`, ServerPeer.value);
    }

    function updateClientPeer(newPeer: RTCPeerConnection | undefined) {
        ClientPeer.value = newPeer
        // console.log(`store update ClientPeer`, ClientPeer.value);
    }

    function updateServerVideoPeer(newPeer: RTCPeerConnection | undefined) {
        ServerVideoPeer.value = newPeer
        // console.log(`store update ServerPeer`, ServerPeer.value);
    }

    function updateClientVideoPeer(newPeer: RTCPeerConnection | undefined) {
        ClientVideoPeer.value = newPeer
        // console.log(`store update ClientPeer`, ClientPeer.value);
    }

    function updateClientSocket(socket: Socket | undefined) {
        if (ClientSocket.value) ClientSocket.value.disconnect()
        ClientSocket.value = socket
    }

    return {
        ServerPeer,
        ClientPeer,
        ServerVideoPeer,
        ClientVideoPeer,
        ClientSocket,
        updateServerPeer,
        updateClientPeer,
        updateServerVideoPeer,
        updateClientVideoPeer,
        updateClientSocket,
    }
})

export { usePeerStore }
