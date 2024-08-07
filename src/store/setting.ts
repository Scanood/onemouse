import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
    state: () => ({
        port: 9527,
        startup: false,
        connectPassword: 1234,
        frameRate: '30'
    }),
    persist: {
        storage: localStorage,
        paths: ['port', 'startup', 'connectPassword', 'frameRate']
    },
})