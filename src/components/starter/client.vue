<template>
    <div style="margin-bottom:1em;">
        <label for="connect-link">服务地址：</label>
        <InputText type="text" id="connect-link" v-model="connectClientLink" style="width: 10em;"
            :disabled="status != StartStatus.STOP" />
    </div>
    <div>
        <label for="connect-link">连接密码：</label>
        <InputText type="text" id="connect-link" v-model="connectClientPassword" style="width: 10em;"
            :disabled="status != StartStatus.STOP" />
    </div>
    <div class="buttons">
        <Button label="启动" v-show="status == StartStatus.STOP" @click="Start" />
        <Button label="停止" v-show="status == StartStatus.RUNNING" @click="Stop" severity="danger" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['mode', 'status', 'SetStatus', 'setChannel', 'setWin', 'toast'])
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { StartStatus, ipPattern } from './types'
import { CloseSocketIO, ClientConnect } from '../../mainprocess/connection/connect'
import { e } from '../../utils/event'
import { ref, onMounted } from 'vue'

let channel: RTCDataChannel = undefined
let winID: number = undefined
const connectClientLink = ref("")
const connectClientPassword = ref(1234)
import { useSettingStore } from '../../store/setting'
import { storeToRefs } from 'pinia'
const store = useSettingStore()
const { port } = storeToRefs(store)

function onPsdError() {
    Stop()
    props.toast.add({ severity: 'error', summary: '系统提示', detail: '密码不正确!', life: 2000 })
}

function onopen() {
    props.toast.removeAllGroups()
    if (props.setChannel) props.setChannel(channel)
    console.log('data channel open success!');
    props.toast.add({ severity: 'success', summary: '系统提示', detail: '成功连接至服务器!', life: 2000 })
    setTimeout(async () => {
        winID = await window.oneMouse.CreateWindow(connectClientLink.value, port.value, connectClientPassword.value)
        if (props.setWin) props.setWin(winID)
    }, 1000)
}

function ClientStart(port: number, password: number) {
    props.toast.removeAllGroups()
    props.toast.add({ severity: 'info', summary: '系统提示', detail: '正在连接服务器......' })
    const rtc = ClientConnect(`http://${connectClientLink.value}`, port, password)
    channel = rtc.channel
    channel.onopen = onopen
}

function Start() {
    if (!ipPattern.test(connectClientLink.value)) {
        props.toast.removeAllGroups()
        props.toast.add({ severity: 'warn', summary: '系统提示', detail: '请输入合法的IP地址!', life: 2000 })
        return
    }
    ClientStart(port.value, connectClientPassword.value)
    props.SetStatus(StartStatus.RUNNING)
}

function Stop() {
    props.toast.removeAllGroups()
    // 关闭当前所有正在监听的行为
    e.emit('close-all-action')
    if (winID) {
        window.oneMouse.CloseWindow(winID)
        winID = undefined
        if (props.setWin) props.setWin(winID)
    }
    channel = undefined
    if (props.setChannel) props.setChannel(channel)
    CloseSocketIO()
    props.SetStatus(StartStatus.STOP)
}

onMounted(() => {
    // vicwindow关闭后停止所有监听的行为
    window.oneMouse.ViceWindowClosed(Stop);
    e.removeAllListeners('socket-error')
    e.on('socket-error', onPsdError)

    e.removeAllListeners('serverRTC-disconnect')
    e.on('serverRTC-disconnect', Stop)
})

</script>

<style scoped>
.starter-panel {
    display: flex;
    justify-content: center;
    flex-direction: row;
    min-width: 550px;
}

.buttons {
    display: flex;
    justify-content: center;
    margin-top: 1em;
}
</style>