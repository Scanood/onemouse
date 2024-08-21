import { KeyBoardEventType, EventType } from './type'
import { BrowserWindow } from "electron"
import { keyboard } from '@scanood/nut-js'
import { keymap } from './keymap'
function KeyBoardCollect(mainWin: BrowserWindow, collect: boolean) {
    BrowserWindow.getAllWindows().filter((win) => win != mainWin).map((win) => {
        win.webContents.send(EventType.KEYBOARD, collect)
    })

}

async function actionKeyBaordEvent(eventType: KeyBoardEventType, code: string) {
    switch (eventType) {
        case KeyBoardEventType.KEYDOWN: keymap.has(code) ? await keyboard.pressKey(keymap.get(code)) : {}; break;
        case KeyBoardEventType.KEYUP: keymap.has(code) ? await keyboard.releaseKey(keymap.get(code)) : {}; break;
    }
}

export {
    KeyBoardCollect,
    actionKeyBaordEvent
}