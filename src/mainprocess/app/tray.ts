import { Tray, nativeImage, Menu, BrowserWindow } from 'electron'
import path from 'path'
let tray: Tray = undefined
function SetupTray(mainWindow: BrowserWindow) {
    console.log(__dirname);
    const icon = nativeImage.createFromPath(path.join(__dirname, 'images/logo.png'))
    tray = new Tray(icon)
    const menu = Menu.buildFromTemplate([
        { label: '打开主页面', type: 'normal', click: () => { mainWindow.show() } },
        { label: '退出', type: 'normal', role: 'quit' },
    ])
    tray.setContextMenu(menu)
    tray.setToolTip('one mouse')
}

function unmountedTray() {
    if (tray) {
        tray.destroy()
        tray = undefined
    }
}

export {
    SetupTray,
    unmountedTray
}