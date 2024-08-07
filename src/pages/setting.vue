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
                <label for="options" style="margin-right: 1em;">帧率：</label>
                <SelectButton v-model="frameRate" :options="['30', '60']" aria-labelledby="basic" :allow-empty="false" />
            </div>
        </div>
    </div>
</template>
<script setup>
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import { useSettingStore } from '../store/setting'
import SelectButton from 'primevue/selectbutton';
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
    row-gap: 2em;
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
    align-items: center;
}
</style>