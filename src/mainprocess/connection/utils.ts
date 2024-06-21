import os from 'os'
import { BrowserWindow } from 'electron'
import path from 'path'
function getLocalIP() {
    const nets = os.networkInterfaces()
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family == 'IPv4' && !net.internal)
                return net.address
        }
    }
    return undefined
}

function createFullWindow(mainWin: BrowserWindow, host_name: string, port: number, password: number) {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon:'images/logo.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })
    const routerPath = `#/control?host=${host_name}&port=${port}&password=${password}`

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + routerPath);
    } else {
        win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), {
            hash: routerPath
        });
    }
    // win.maximize()
    if (process.env.NODE_ENV === 'development'){
        win.webContents.openDevTools();
    }
    win.on('closed', () => {
        mainWin.webContents.send('close-vicewindow')
    })    
    return win.id
}

function CloseWindow(win: number) {

    BrowserWindow.fromId(win)?.close()
}

export {
    getLocalIP,
    createFullWindow,
    CloseWindow
}