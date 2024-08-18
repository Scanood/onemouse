<template>
    <div>
        <Mode :mode="mode" :setMode="setMode" :disabled="status == StartStatus.RUNNING" class="index-panel" />
        <Starter :mode="mode" :status="status" :SetStatus="SetStatus" :setChannel="setChannel" :setWin="setWin" />
        <Controller :hide="mode == WorkMode.SERVER" :collectEvent="collectEvent" />
    </div>
</template>
<script setup lang="ts">
import Mode from '../components/mode/index.vue'
import useMode from '../components/mode/useMode'
import Starter from '../components/starter/index.vue'
import useStarter from '../components/starter/useStarter';
import { StartStatus } from '../components/starter/types';
import { WorkMode } from '../components/mode/type'
import { EventType, ActionType, ActionKey, KeyBoardEventType } from '../components/controller/type'
import Controller from '../components/controller/index.vue'
import { taskManger } from '../utils/task'
import { useSettingStore } from '../store/setting'
const { mode, setMode } = useMode()
const { status, SetStatus } = useStarter()
const settingStore = useSettingStore()
import { ref, watch, onMounted } from 'vue'
let channel: RTCDataChannel
// viceWindow ID
let newWin = ref()

onMounted(() => {
    mountedMouseEvent(false)
    mountedKeyBoardEvent(false)
})

function setChannel(ch: RTCDataChannel) {
    channel = ch
    function sendMousePosition(x: number, y: number) {
        channel.send(JSON.stringify({ type: EventType.MOUSE, data: { x, y } }))
    }
    window.oneMouse.RTCSendMousePosition(sendMousePosition)
}
function setWin(win: number) { newWin.value = win }

// 挂载鼠标事件
function mountedMouseEvent(collect: boolean) {
    // position
    window.oneMouse.CollectionMousePosition(collect, newWin.value)
    // event
    function sendMouseEvent(actionType: ActionType, actionKey: ActionKey) {
        channel.send(JSON.stringify({ type: EventType.MOUSEEVENT, data: { actionType, actionKey } }))
    }
    function notSendMouseEvent(actionType: ActionType, actionKey: ActionKey) { }
    if (collect) window.oneMouse.RTCSendMouseEvent(sendMouseEvent)
    else window.oneMouse.RTCSendMouseEvent(notSendMouseEvent)
}

// 挂载键盘事件
function mountedKeyBoardEvent(collect: boolean) {
    function sendKeyBoardEvent(eventType: KeyBoardEventType, code: string) {
        channel.send(JSON.stringify({ type: EventType.KEYBOARD, data: { eventType, code } }))
    }
    function notSendKeyBoardEvent(eventType: KeyBoardEventType, code: string) { }
    if (collect) window.oneMouse.RTCSendKeyBoardEvent(sendKeyBoardEvent)
    else window.oneMouse.RTCSendKeyBoardEvent(notSendKeyBoardEvent)
}


function RunTask(eventType: string, collect: boolean) {
    switch (eventType) {
        case EventType.MOUSE: mountedMouseEvent(collect); break;
        case EventType.KEYBOARD: mountedKeyBoardEvent(collect); break;
        case EventType.SCREEN: if (channel) channel.send(JSON.stringify({ type: eventType, data: { open: collect, frameRate: settingStore.frameRate } })); break
    }
}

function collectEvent(eventType: string, collect: boolean) {
    // 连接未建立时将任务进行保存
    if ((!channel || !newWin)) {
        if (collect) taskManger.add(eventType)
        else taskManger.delete(eventType)
        return
    }
    RunTask(eventType, collect)
}

// run task 在连接建立之前设置的控制任务
watch(newWin, (newValue, _) => {
    if (newValue && taskManger.tasks.length > 0) {
        taskManger.tasks.forEach(({ eventType, collect }) => {
            RunTask(eventType, collect)
        })
        taskManger.clear()
    }
})

</script>

<style scoped>
.index-panel {
    margin-top: 1em;
}
</style>