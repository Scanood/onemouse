<template>
    <div class="setting">
        <div>
            <Checkbox v-model="startup" inputId="startup" indeterminate binary @update:model-value="AutoStart" />
            <label for="startup" style="margin-left: 1em;">开机自动启动服务端模式</label>
        </div>

        <div>
            <label for="port" style="margin-right: 1em;">服务端口：</label>
            <InputNumber 
            v-model="port" 
            inputId="port" 
            :useGrouping="false" 
            :allowEmpty="false" 
            :max="65535"
            :min="0"
            :inputStyle="{'width':'6em'}"
            />
        </div>
    </div>
</template>
<script setup>
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import { useSettingStore } from '../store/setting'
import { storeToRefs } from 'pinia'
const store = useSettingStore()
const { startup, port } = storeToRefs(store)
function AutoStart(start){
    window.oneMouse.AutoLaunch(start)
}
</script>

<style scoped>
.setting {
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 2em;
    max-width: 550px;
}
</style>