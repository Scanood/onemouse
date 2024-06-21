import { ref } from 'vue'
import { WorkMode } from './type'
export default function () {
    const mode = ref(WorkMode.SERVER)
    function setMode(value: WorkMode.CLIENT | WorkMode.SERVER) {
        mode.value = value
    }
    return { mode, setMode }
}