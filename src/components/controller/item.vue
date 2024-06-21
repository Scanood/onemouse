<template>
    <div class="control-item">
        <div>{{ title }}</div>
        <InputSwitch @update:model-value="ChangeValue" :model-value="checked" />
    </div>
</template>

<script setup lang="ts">
import InputSwitch from 'primevue/inputswitch';
const props = defineProps(['checked', 'setchecked', 'title'])

function ChangeValue(value: Boolean) {
    if (props.setchecked) props.setchecked(value)
}

</script>
<style scoped>
.control-item {
    display: flex;
    flex-direction: row;
    width: 6em;
    justify-content: space-evenly;
}
</style>