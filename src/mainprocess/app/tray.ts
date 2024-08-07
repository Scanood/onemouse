import { Tray, nativeImage, Menu, BrowserWindow } from 'electron'
import path from 'path'
function SetupTray(mainWindow: BrowserWindow) {
    console.log(__dirname);
    const icon = nativeImage.createFromPath(path.join(__dirname, 'images/logo.png'))
    const tray = new Tray(icon)
    const menu = Menu.buildFromTemplate([
        { label: '打开主页面', type: 'normal', click: () => { mainWindow.show() } },
        { label: '退出', type: 'normal', role: 'quit' },
    ])
    tray.setContextMenu(menu)
    tray.setToolTip('one mouse')
}

export {
    SetupTray
}