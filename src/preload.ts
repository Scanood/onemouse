// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { EventType, ActionKey, ActionType, KeyBoardEventType } from './components/controller/type'
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

  // 渲染进程到主进程接受键盘事件
  GetKeyboardEvent: (eventType: KeyBoardEventType, code: string) => {
    ipcRenderer.send('get-keyboard', eventType, code)
  },

  // 渲染进程提供RTC发送键盘事件
  RTCSendKeyBoardEvent: (callback: (eventType: KeyBoardEventType, code: string) => void) => {
    ipcRenderer.removeAllListeners(EventType.KEYBOARD);
    ipcRenderer.on(EventType.KEYBOARD, (event, eventType, code) => callback(eventType, code))
  },

  // 执行键盘输入事件
  KeyBoardEventAction: (data: KeyBoardData) => ipcRenderer.send('keyboard-event', data),

  // 设置开机自启
  AutoLaunch: (start: boolean) => ipcRenderer.send('auto-start', start),

  // 服务端 端口被占用提示
  ServerPortInuse: (callback: () => void) => {
    ipcRenderer.removeAllListeners('server-port-inuse')
    ipcRenderer.on('server-port-inuse', () => callback())
  }
}

contextBridge.exposeInMainWorld('oneMouse', mapping)

declare global {
  interface Window {
    oneMouse: typeof mapping;
  }
}