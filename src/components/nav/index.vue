<template>
    <TabMenu :model="routers">
        <template #item="{ item, props }">
            <RouterLink v-if="item.path" v-slot="{ href, navigate }" :to="item.path" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span v-bind="props.icon" />
                    <span v-bind="props.label">{{ item.label }}</span>
                </a>
            </RouterLink>
        </template>
    </TabMenu>
</template>
<script setup>
import TabMenu from 'primevue/tabmenu';
import { ref } from "vue";
import { RouterLink } from 'vue-router'
const routers = ref([
    { label: '首页', icon: 'pi pi-home', path: '/' },
    { label: '设置', icon: 'pi pi-cog', path: '/setting' }
])
</script>
