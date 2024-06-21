import { KeyBoardEventType, EventType } from './type'
import { BrowserWindow } from "electron"
import { keyboard } from '@scanood/nut-js'
import { keymap } from './keymap'
function getKeyBoardEvent(mainWin: BrowserWindow, eventType: KeyBoardEventType, code: string) {
    mainWin.webContents.send(EventType.KEYBOARD, eventType, code)
}

async function actionKeyBaordEvent(eventType: KeyBoardEventType, code: string) {
    switch (eventType) {
        case KeyBoardEventType.KEYDOWN: keymap.has(code) ? await keyboard.pressKey(keymap.get(code)) : {}; break;
        case KeyBoardEventType.KEYUP: keymap.has(code) ? await keyboard.releaseKey(keymap.get(code)) : {}; break;
    }
}

export {
    getKeyBoardEvent,
    actionKeyBaordEvent
}