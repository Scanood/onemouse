<template>
    <div class="control" @mousedown="mousedown" @mouseup="mouseup">
        <video width="100%" height="100%" ref="video" style="object-fit: fill;" tabindex="-1"></video>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ClientVideoConnect } from '../mainprocess/connection/connect'
import { ActionType, ActionKey, KeyBoardEventType } from '../components/controller/type'
import { useRoute } from 'vue-router'
const route = useRoute()
const video = ref<HTMLVideoElement>(undefined)


onMounted(() => {
    video.value.addEventListener('wheel', (event: WheelEvent) => {
        // 向下滚动
        if (event.deltaY > 0) window.oneMouse.GetMouseEvent(ActionType.WHEEL, ActionKey.SCROLLDOWN)
        // 向上滚动
        if (event.deltaY < 0) window.oneMouse.GetMouseEvent(ActionType.WHEEL, ActionKey.SCROLLUP)
    })

    video.value.addEventListener('keydown', (e: KeyboardEvent) => {
        window.oneMouse.GetKeyboardEvent(KeyBoardEventType.KEYDOWN, e.code)
    })

    video.value.addEventListener('keyup', (e: KeyboardEvent) => {
        window.oneMouse.GetKeyboardEvent(KeyBoardEventType.KEYUP, e.code)
    })
    const host_name = route.query.host
    const port = Number(route.query.port)
    const password = Number(route.query.password)

    setTimeout(() => {
        const rtc = ClientVideoConnect(`http://${host_name}`, port, password)
        rtc.ontrack = ontrack
    }, 500)
})

function ontrack(ev: RTCTrackEvent) {
    video.value.srcObject = ev.streams[0]
    video.value.onloadedmetadata = () => {
        video.value.play();
    };
}

function mousedown(e: MouseEvent) {
    window.oneMouse.GetMouseEvent(ActionType.PRESS, e.button)
}

function mouseup(e: MouseEvent) {
    window.oneMouse.GetMouseEvent(ActionType.RELEASE, e.button)
}


</script>

<style scoped>
.control {
    position: fixed;
    top: 10px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    background-color: cadetblue;
}
</style>