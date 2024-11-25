import { app, ipcMain, BrowserWindow } from 'electron'
import { getLocalIP, createFullWindow, CloseWindow } from './utils'
import { CreateWS, StopWS } from './ws'


function InitProcess(mainWin: BrowserWindow) {
    // createFullWindow()
    app.whenReady().then(() => {
        ipcMain.handle('start-server', (event, port, password) => {
            return CreateWS(port, password)
        })

        ipcMain.on('stop-server', StopWS)

        ipcMain.handle('get-localIP', getLocalIP)

        ipcMain.handle('create-window', (event, host_name: string, port: number, password: number) => {
            return createFullWindow(mainWin, host_name, port, password)
        })

        ipcMain.on('close-window', (event, win: number) => {
            CloseWindow(win)
        })

        ipcMain.on('hide-win',()=>{
            mainWin.hide()
        })
        ipcMain.on('close-win',()=>{
            mainWin.close()
        })
    })
}
export {
    InitProcess
}