import { defineStore } from "pinia";
import { ref } from 'vue'
const usePeerStore = defineStore('peer', () => {

    const ServerPeer = ref<RTCPeerConnection>(undefined)
    const ClientPeer = ref<RTCPeerConnection>(undefined)
    const ServerVideoPeer = ref<RTCPeerConnection>(undefined)
    const ClientVideoPeer = ref<RTCPeerConnection>(undefined)


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

    return {
        ServerPeer,
        ClientPeer,
        ServerVideoPeer,
        ClientVideoPeer,
        updateServerPeer,
        updateClientPeer,
        updateServerVideoPeer,
        updateClientVideoPeer

    }
})

export { usePeerStore }
