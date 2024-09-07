<template>
    <Nav v-show="!hideNav" />
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" style="min-width: 650px;" />
        </keep-alive>
    </router-view>
</template>

<script setup>
import Nav from './components/nav/index.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
const route = useRoute()
const hideNav = ref(false)

watch(() => route.path, (newValue, _) => {
    hideNav.value = newValue === '/control'
})
</script>