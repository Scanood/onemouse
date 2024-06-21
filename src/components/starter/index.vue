<template>
    <div class="starter-panel">
        <div v-show="mode == WorkMode.SERVER" style="display: flex;flex-direction: column;">
            <Server :mode="mode" :status="status" :SetStatus="SetStatus" :toast="toast" />
        </div>

        <div v-show="mode == WorkMode.CLIENT">
            <Client :mode="mode" :status="status" :SetStatus="SetStatus" :setChannel="setChannel" :setWin="setWin"
                :toast="toast" />
        </div>
        <Toast position="bottom-right" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import { WorkMode } from '../mode/type'
import Server from './server.vue'
import Client from './client.vue'

const toast = useToast()
defineProps(['mode', 'status', 'SetStatus', 'setChannel', 'setWin'])

</script>

<style scoped>
.starter-panel {
    display: flex;
    justify-content: center;
    flex-direction: row;
    min-width: 550px;
}
</style>