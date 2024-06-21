<template>
    <div class="buttons">
        <div v-for="category in categories" :key="category.key" class="item">
            <RadioButton @change="changeMode" name="dynamic" :inputId="category.key" :value="category.key"
                :disabled="disabled" :modelValue="mode" />
            <label :for="category.key" class="label">{{ category.name }}</label>
        </div>
    </div>
</template>

<script setup lang="ts">
import RadioButton from 'primevue/radiobutton';
import { ref } from 'vue'
import { WorkMode } from './type'
const props = defineProps(['mode', 'setMode', 'disabled'])
const categories = ref([
    { name: '服务器模式', key: WorkMode.SERVER },
    { name: '客户端模式', key: WorkMode.CLIENT },
]);

function changeMode(event: Event) {
    if (props.mode && props.setMode) {
        const value = (<HTMLInputElement>event.target).value
        props.setMode(value)
    }
}
</script>

<style scoped>
.item {
    margin: 2em 0px;
}

.label {
    margin-left: 10px;
}

.label:hover {
    cursor: pointer;
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 40%;
    margin: 10px auto;
    min-width: 550px;
}
</style>
