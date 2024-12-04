<template>
    <div class="header">
        <div class="icon">
            <img :src="logo" alt="" width="20px" height="20px">
            <span class="title">{{ route.meta.title }}</span>
        </div>
        <div class="opt">
            <i class="pi pi-minus" @click="hide"></i>
            <i class="pi pi-times" @click="close"></i>
        </div>
    </div>
</template>


<script setup>
import logo from '../../../images/logo.png'
import { useRoute } from 'vue-router'
const route = useRoute()

const hide = () => {
    window.oneMouse.hideWin()
}

const close = () => {
    window.oneMouse.closewin()
}
</script>

<style scoped>
.header {
    width: 100%;
    height: 30px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    -webkit-app-region: drag;
    display: flex;
    justify-content: space-between;
    color: rgb(105, 98, 139);
}

.opt {
    padding: 5px;
    margin-right: 10px;
    -webkit-app-region: no-drag
}

.opt :first-child {
    margin-right: 20px;
}

.opt i:hover {
    color: #10b981;
}

.icon {
    padding: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.title{
    margin-left: 10px;
    line-height: 1;
    font-weight: 600;
}
</style>