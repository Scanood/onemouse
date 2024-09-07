<template>
    <div>
        <Tabs value="0">
            <div class="tabs">
                <TabList>
                    <Tab value="0" :disabled="status === StartStatus.RUNNING" class="tab">
                        服务器
                    </Tab>
                    <Tab value="1" :disabled="status === StartStatus.RUNNING" class="tab">
                        客户端
                    </Tab>
                </TabList>
            </div>
            <TabPanels>
                <TabPanel value="0">
                    <server :toast="toast" :status="status" :SetStatus="SetStatus" />
                </TabPanel>
                <TabPanel value="1">
                    <client :toast="toast" :setWin="setWin" :setChannel="setChannel" :status="status" :SetStatus="SetStatus" />
                    <Controller :collectEvent="collectEvent" />
                </TabPanel>
            </TabPanels>
        </Tabs>
        <Toast position="bottom-right" />
    </div>
</template>
<script setup lang="ts">
import { EventType, ActionType, ActionKey } from '../components/controller/type'
import Controller from '../components/controller/index.vue'
import { taskManger } from '../utils/task'
import { useSettingStore } from '../store/setting'
import server from '../components/starter/server.vue'
import client from '../components/starter/client.vue'
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import useStarter from '../components/starter/useStarter'
import { StartStatus } from '../components/starter/types'
const { status, SetStatus } = useStarter()
const settingStore = useSettingStore()
import { ref, watch, onMounted } from 'vue'
let channel: RTCDataChannel
// viceWindow ID
let newWin = ref()
const toast = useToast()
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

// 挂载键盘事件 渲染进程1-主进程-渲染进程2
function mountedKeyBoardEvent(collect: boolean) {
    window.oneMouse.KeyBoardCollect(collect)
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

.tab {
    width: 50%;
}

.tabs {
    width: 70%;
    margin: auto;
    margin-top: 2em;
    margin-bottom: 1em;
}
</style>