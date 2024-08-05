import { Tray, nativeImage, Menu, BrowserWindow } from 'electron'

function SetupTray(mainWindow: BrowserWindow) {
    const icon = nativeImage.createFromPath('images/logo.png')
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