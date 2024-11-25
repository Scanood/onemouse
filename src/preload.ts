// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { EventType, ActionKey, ActionType } from './components/controller/type'
import { MouseData, MouseEventData, KeyBoardData } from './components/starter/types'

import { contextBridge, ipcRenderer } from 'electron'


const mapping = {
  StartServer: (port: number, password: number) => ipcRenderer.invoke('start-server', port, password),
  StopServer: () => ipcRenderer.send('stop-server'),
  GetLocalIP: () => ipcRenderer.invoke('get-localIP'),
  CreateWindow: (host_name: string, port: number, password: number) => ipcRenderer.invoke('create-window', host_name, port, password),
  CloseWindow: (win: number) => ipcRenderer.send('close-window', win),
  CollectionMousePosition: (collect: boolean, win: number) => ipcRenderer.send('get-mouse', collect, win),
  // move mouse
  MouseAction: (data: MouseData) => ipcRenderer.send('mouse-move', data),

  GetDeskTopId: () => ipcRenderer.invoke('get-desktopId'),

  RTCSendMousePosition: (callback: (x: number, y: number) => void) => {
    ipcRenderer.removeAllListeners(EventType.MOUSE)    // avoid memory leak
    ipcRenderer.on(EventType.MOUSE, (event, x, y) => callback(x, y))
  },

  ViceWindowClosed: (callback: () => void) => {
    ipcRenderer.removeAllListeners('close-vicewindow') // avoid memory leak
    ipcRenderer.on('close-vicewindow', () => callback())
  },

  // 渲染进程到主进程接受鼠标事件
  GetMouseEvent: (actionType: ActionType, actionKey: ActionKey) => {
    ipcRenderer.send('get-mouseevent', actionType, actionKey)
  },

  // 渲染进程提供RTC发送鼠标事件
  RTCSendMouseEvent: (callback: (actionType: ActionType, actionKey: ActionKey) => void) => {
    ipcRenderer.removeAllListeners(EventType.MOUSEEVENT);
    ipcRenderer.on(EventType.MOUSEEVENT, (event, actionType, actionKey) => callback(actionType, actionKey))
  },

  // 执行鼠标点击事件
  MouseEventAction: (data: MouseEventData) => ipcRenderer.send('mouse-event', data),

  // 客户端是否发送键盘事件
  KeyBoardCollect: (collect: boolean) => ipcRenderer.send('keyboard-collect', collect),

  // 键盘是否监听
  onKeyBaordCollect: (cb: (args: boolean) => void) => {
    ipcRenderer.removeAllListeners(EventType.KEYBOARD)
    ipcRenderer.on(EventType.KEYBOARD, (_, collect) => cb(collect))
  },

  // 执行键盘输入事件
  KeyBoardEventAction: (data: KeyBoardData) => ipcRenderer.send('keyboard-event', data),

  // 设置开机自启
  AutoLaunch: (start: boolean) => ipcRenderer.send('auto-start', start),

  // 服务端 端口被占用提示
  ServerPortInuse: (callback: () => void) => {
    ipcRenderer.removeAllListeners('server-port-inuse')
    ipcRenderer.on('server-port-inuse', () => callback())
  },
  // 最小化
  hideWin:()=>ipcRenderer.send('hide-win'),

  //退出软件
  closewin:()=>ipcRenderer.send('close-win')
}

contextBridge.exposeInMainWorld('oneMouse', mapping)

declare global {
  interface Window {
    oneMouse: typeof mapping;
  }
}