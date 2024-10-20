<template>
    <div>
        <div style="display: flex;justify-content: center;">
            <div>
                <div style="margin-bottom:1em;">
                    <label for="connect-link">本机地址：</label>
                    <InputText type="text" id="connect-link" :disabled="!manualIP" v-model="connectLink"
                        style="width: 10em;" />
                    <Button icon="pi pi-sync" style="margin-left: 5px;" text rounded @click="getServerIP" />
                </div>
                <div>
                    <label for="connect-link">连接密码：</label>
                    <InputText type="text" id="connect-link" :disabled="status != StartStatus.STOP"
                        v-model="connectPassword" style="width: 10em;" />
                </div>
            </div>
        </div>
        <div class="buttons">
            <Button label="启动" v-show="status == StartStatus.STOP" @click="Start" />
            <Button label="停止" v-show="status == StartStatus.RUNNING" @click="Stop" severity="danger" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { EventType } from '../controller/type'
import { StartStatus, RTCdata, MouseData, ScreenData, MouseEventData, KeyBoardData } from './types'
import { ServerConnect, CloseSocketIO, ServerVideoConnect } from '../../mainprocess/connection/connect'
import { ref, onMounted, watch } from 'vue'
import { usePeerStore } from '../../store/index'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '../../store/setting'

const props = defineProps(['status', 'SetStatus', 'toast'])
const connectLink = ref("")
const manualIP = ref(false)
const store = usePeerStore()
const settingStore = useSettingStore()
const { port, startup, connectPassword } = storeToRefs(settingStore)
const { ServerVideoPeer } = storeToRefs(store)
let send: RTCRtpSender = undefined
let streams: MediaStream = undefined

async function getServerIP() {
    const ip = await window.oneMouse.GetLocalIP()
    if (ip == undefined) {
        manualIP.value = true
        props.toast.add({ severity: 'warn', summary: '系统提示', detail: '请手动设置本机IP！', life: 2000 })
    }
    connectLink.value = ip
}

onMounted(() => {
    getServerIP()
    window.oneMouse.ServerPortInuse(onServerPortinUse)
    if (startup.value) Start()
})

async function CatchDesktopVideo(data: ScreenData) {
    const open = data.open
    const sourceId = await window.oneMouse.GetDeskTopId()
    if (!ServerVideoPeer.value) {
        ServerVideoConnect(`http://${connectLink.value}`, port.value, connectPassword.value, onmessage)
    }
    if (!open && send) {
        ServerVideoPeer.value.removeTrack(send)
        streams.getTracks().forEach((track) => {
            track.stop()
        })
        streams = undefined
        send = undefined
        return
    }
    const { frameRate, audio } = data

    if (frameRate) settingStore.updateFrameRate(frameRate)
    if (ServerVideoPeer.value && sourceId) {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: audio,
                video: {
                    frameRate: Number.parseInt(settingStore.frameRate)
                }
            })
            streams = stream
            stream.getTracks().forEach(track => { send = ServerVideoPeer.value.addTrack(track, stream) })
            // https://stackoverflow.com/questions/67537807/webrtc-peerconnection-addtrack-after-connection-established

        } catch (e) {
            console.log(e);
        }
    }
}

// 处理接受的datachannel消息
function onmessage(event: MessageEvent<any>) {
    const data: RTCdata = JSON.parse(event.data)
    switch (data.type) {
        case EventType.MOUSE: window.oneMouse.MouseAction(data.data as MouseData); break;
        case EventType.MOUSEEVENT: window.oneMouse.MouseEventAction(data.data as MouseEventData); break;
        case EventType.SCREEN: CatchDesktopVideo(data.data as ScreenData); break;
        case EventType.KEYBOARD: window.oneMouse.KeyBoardEventAction(data.data as KeyBoardData); break;
    }
}

async function ServerStart(port: number, password: number) {
    await window.oneMouse.StartServer(port, password)
    ServerConnect(`http://${connectLink.value}`, port, password, onmessage)
    ServerVideoConnect(`http://${connectLink.value}`, port, password, onmessage)
}

function Start() {
    ServerStart(port.value, connectPassword.value)
    props.SetStatus(StartStatus.RUNNING)
}

function Stop() {
    props.toast.removeAllGroups()
    window.oneMouse.StopServer()
    CloseSocketIO()
    ServerVideoPeer.value.close()
    ServerVideoPeer.value = undefined
    props.SetStatus(StartStatus.STOP)
}

function onServerPortinUse() {
    Stop()
    props.toast.add({ severity: 'warn', summary: '系统提示', detail: '当前端口被占用！', life: 2000 })
}

// 确保服务端始终拥有ServerVideoPeer
watch(ServerVideoPeer, (newpeer, oldpeer) => {
    if (newpeer === undefined) {
        console.log(`watch create new videoPeer`);
        ServerVideoConnect(`http://${connectLink.value}`, port.value, connectPassword.value, onmessage)
    }
})

</script>

<style scoped>
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 1em;
}
</style>