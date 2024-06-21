<template>
    <div v-if="!hide" class="control-panel">
        <CheckItem title="鼠标" :checked="mouse" :setchecked="setMouse" />
        <CheckItem title="键盘" :checked="keyboard" :setchecked="setKeyboard" />
        <CheckItem title="屏幕" :checked="screen" :setchecked="setScreen" />
    </div>
</template>

<script setup lang="ts">
import CheckItem from './item.vue'
const props = defineProps(['hide', 'collectEvent'])
import useValue from './useChecked'
import { EventType } from './type'
import { onMounted, watch, } from 'vue'
import { e } from '../../utils/event'
const [mouse, setMouse] = useValue()
const [keyboard, setKeyboard] = useValue()
const [screen, setScreen] = useValue()

// watch mouse
watch(mouse, (newValue, _) => {
    if (props.collectEvent)
        props.collectEvent(EventType.MOUSE, newValue)
})

// watch screen
watch(screen, (newValue, _) => {
    if (props.collectEvent)
        props.collectEvent(EventType.SCREEN, newValue)
})

// watch keyboard
watch(keyboard, (newValue, _) => {
    if (props.collectEvent)
        props.collectEvent(EventType.KEYBOARD, newValue)
})


onMounted(() => {
    e.removeAllListeners('close-all-action')
    e.on('close-all-action', () => {
        [setMouse, setKeyboard, setScreen].forEach((callback) => (callback as Function).call(this, false))
    })
})


</script>
<style scoped>
.control-panel {
    min-width: 550px;
    display: flex;
    margin-top: 2em;
    justify-content: center;
}
</style>