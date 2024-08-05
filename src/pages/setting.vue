<template>
    <div class="setting">
        <div>
            <Checkbox v-model="startup" inputId="startup" indeterminate binary @update:model-value="AutoStart" />
            <label for="startup" style="margin-left: 1em;">开机自动启动服务端模式</label>
        </div>

        <div>
            <label for="port" style="margin-right: 1em;">服务端口：</label>
            <InputNumber v-model="port" inputId="port" :useGrouping="false" :allowEmpty="false" :max="65535" :min="0"
                :inputStyle="{ 'width': '6em' }" />
        </div>

        <div>
            <div id="options" class="options">
                <label for="options">帧率：</label>
                <div class="options-item-item">
                    <RadioButton v-model="frameRate" inputId="30rate" value="30" />
                    <label for="30rate" class="options-item-label">30fps</label>
                </div>
                <div class="options-item-item">
                    <RadioButton v-model="frameRate" inputId="60rate" value="60" />
                    <label for="60rate" class="options-item-label">60fps</label>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import { useSettingStore } from '../store/setting'
import RadioButton from 'primevue/radiobutton';
import { storeToRefs } from 'pinia'
const store = useSettingStore()
const { startup, port, frameRate } = storeToRefs(store)
function AutoStart(start) {
    window.oneMouse.AutoLaunch(start)
}
</script>

<style scoped>
.setting {
    display: grid;
    row-gap: 1em;
    grid-template-columns: 1fr 1fr;
    margin: auto;
    margin-top: 2em;
    max-width: 600px;
    align-items: center;
    justify-items: left;
    justify-content: center;
}

.options {
    display: flex;
}

.options-item-label {
    margin-left: 0.5em;
}
.options-item-item{
    margin-left: 1em;
}
</style>