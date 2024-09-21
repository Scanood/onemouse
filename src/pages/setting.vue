<template>
    <Panel header="系统设置" style="margin-top: 2em;">
        <div class="setting">
            <div>
                <Checkbox v-model="startup" inputId="startup" binary @update:model-value="AutoStart" />
                <label for="startup" style="margin-left: 1em;">开机自动启动服务端模式</label>
            </div>
            <div>
                <label for="port" style="margin-right: 0.5em;">服务端口：</label>
                <InputNumber v-model="port" inputId="port" :useGrouping="false" :allowEmpty="false" :max="65535"
                    :min="0" showButtons />
            </div>
            <div>
                <Checkbox v-model="audio" inputId="audio" binary />
                <label for="audio" style="margin-left: 1em;">启动屏幕连接时获取声音</label>
            </div>
            <div>
                <div id="options" class="options">
                    <label for="options" style="margin-right: 0.5em;">最大帧率：</label>
                    <SelectButton v-model="frameRate" :options="['30', '60']" aria-labelledby="basic"
                        :allow-empty="false" />
                </div>
            </div>
        </div>
    </Panel>
</template>
<script setup>
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import { useSettingStore } from '../store/setting'
import SelectButton from 'primevue/selectbutton';
import Panel from 'primevue/panel';
import { storeToRefs } from 'pinia'
const store = useSettingStore()
const { startup, port, frameRate, audio } = storeToRefs(store)
function AutoStart(start) {
    window.oneMouse.AutoLaunch(start)
}
</script>

<style scoped>
.setting {
    margin: 0 0.5em;
    display: grid;
    row-gap: 2em;
    align-items: center;
    grid-template-columns: 1fr 1fr;
}

.options {
    display: flex;
    align-items: center;
}
</style>