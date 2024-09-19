import { BrowserWindow, screen, app } from 'electron'
import { EventType, MouseData, ActionType, ActionKey } from './type'
import { mouse, Point, Button } from '@scanood/nut-js'

mouse.config.autoDelayMs = 5
let timer: NodeJS.Timeout = undefined
const Offset = 5
const yTopOffset = 10

let width = 0
let height = 0
let scaleFactor = 1

app.on('ready', () => {
    const size = screen.getPrimaryDisplay().size
    width = size.width
    height = size.height
    scaleFactor = screen.getPrimaryDisplay().scaleFactor
})

function isValidArea(cx: number, cy: number, winx: number, winy: number, width: number, height: number) {
    if ((cx < (winx + width - Offset) && cx > winx + Offset) && (cy < (winy + height - Offset) && cy > winy + yTopOffset))
        return true
    return false
}

function CollectMousePosition(collect: boolean, win: number, mainWin: BrowserWindow) {
    if (collect) {
        timer = setInterval(() => {
            if (!win) return
            const viceWindow = BrowserWindow.fromId(win)
            if (!viceWindow && timer) return
            const { x: cx, y: cy } = screen.getCursorScreenPoint()
            const { x: winx, y: winy, width, height } = viceWindow.getContentBounds()
            if (!isValidArea(cx, cy, winx, winy, width, height)) return
            const xnum = (cx - winx - Offset) / (width - 2 * Offset)
            const ynum = (cy - winy - yTopOffset) / (height - Offset - yTopOffset)
            mainWin.webContents.send(EventType.MOUSE, xnum, ynum)
        }, 10)

    } else {
        if (timer) clearInterval(timer)
    }
}

// 主进程发送鼠标事件到渲染进程
function sendMouseAction(mainWin: BrowserWindow, actionType: ActionType, actionKey: ActionKey) {
    mainWin.webContents.send(EventType.MOUSEEVENT, actionType, actionKey)
}


// server side
async function mouseAction(data: MouseData) {
    const { x, y } = data
    const point = new Point(x * width * scaleFactor, y * height * scaleFactor)
    await mouse.move([point])
}

function convertEnum(actionKey: ActionKey): Button {
    switch (actionKey) {
        case ActionKey.LEFT: return Button.LEFT;
        case ActionKey.MIDDLE: return Button.MIDDLE;
        case ActionKey.RIGHT: return Button.RIGHT;
    }
}

// 鼠标滚轮
async function handleMouseWheel(actionKey: ActionKey) {
    switch (actionKey) {
        case ActionKey.SCROLLDOWN: await mouse.scrollDown(2); break;
        case ActionKey.SCROLLUP: await mouse.scrollUp(2); break;
    }
}

async function MouseEventAction(actionType: ActionType, actionKey: ActionKey) {
    switch (actionType) {
        case ActionType.PRESS: await mouse.pressButton(convertEnum(actionKey)); break;
        case ActionType.RELEASE: await mouse.releaseButton(convertEnum(actionKey)); break;
        case ActionType.WHEEL: await handleMouseWheel(actionKey); break;
    }
}

export {
    CollectMousePosition,
    mouseAction,
    sendMouseAction,
    MouseEventAction
}