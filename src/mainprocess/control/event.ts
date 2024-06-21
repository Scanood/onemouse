import { app, ipcMain, BrowserWindow } from 'electron'
import { CollectMousePosition, mouseAction, sendMouseAction, MouseEventAction } from './mouse'
import { CatchDeskTopSourceId } from './screen'
import { getKeyBoardEvent, actionKeyBaordEvent } from './keyboard'
import { AutoLaunch } from './startup'
function InitEvent(mainWin: BrowserWindow) {
    app.whenReady().then(() => {
        ipcMain.on('get-mouse', (event, collect: boolean, win: number) => {
            CollectMousePosition(collect, win, mainWin)
        })
        ipcMain.on('mouse-move', (event, data) => {
            mouseAction(data)
        })
        ipcMain.handle('get-desktopId', CatchDeskTopSourceId)

        ipcMain.on('get-mouseevent', (event, actionType, actionKey) => {
            sendMouseAction(mainWin, actionType, actionKey)
        })

        ipcMain.on('mouse-event', (event, { actionType, actionKey }) => {
            MouseEventAction(actionType, actionKey)
        })

        ipcMain.on('get-keyboard', (event, eventType, code) => {
            getKeyBoardEvent(mainWin, eventType, code)
        })

        ipcMain.on('keyboard-event', (event, { eventType, code }) => {
            actionKeyBaordEvent(eventType, code)
        })

        ipcMain.on('auto-start', (event, start) => {
            AutoLaunch(app, start)
        })

        process.on('uncaughtException', (error) => {
            // 捕获到未处理的异常后的处理代码
            console.error(error.message);
            // 端口被占用
            if (error.message.startsWith('listen EADDRINUSE')) {
                mainWin.webContents.send('server-port-inuse')
            }
        });
    })
}

export {
    InitEvent
}