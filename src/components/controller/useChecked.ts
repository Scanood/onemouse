import { ref } from 'vue'
export default function () {
    const checked = ref(false)
    function setChecked(value: boolean): void {
        checked.value = value
    }
    return [checked, setChecked]
}