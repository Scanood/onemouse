import { KeyBoardEventType, EventType } from './type'
import { BrowserWindow } from "electron"
import { keyboard } from '@scanood/nut-js'
import { keymap } from './keymap'

keyboard.config.autoDelayMs = 5

function KeyBoardCollect(mainWin: BrowserWindow, collect: boolean) {
    BrowserWindow.getAllWindows().filter((win) => win != mainWin).map((win) => {
        win.webContents.send(EventType.KEYBOARD, collect)
    })

}

async function actionKeyBaordEvent(eventType: KeyBoardEventType, code: string) {
    const key = keymap.get(code)
    if (!key) return
    switch (eventType) {
        case KeyBoardEventType.KEYDOWN: keyboard.pressKey(key); break;
        case KeyBoardEventType.KEYUP: keyboard.releaseKey(key); break;
    }
}

export {
    KeyBoardCollect,
    actionKeyBaordEvent
}