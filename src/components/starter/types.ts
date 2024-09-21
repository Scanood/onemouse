import { EventType, ActionKey, ActionType, KeyBoardEventType } from '../controller/type'

enum StartStatus {
    RUNNING = 'running',
    LOADING = 'loading',
    STOP = 'stop'
}

interface MouseData {
    x: number,
    y: number
}

interface MouseEventData {
    actionType: ActionType,
    actionKey: ActionKey
}

interface ScreenData {
    open: boolean,
    frameRate: string,
    audio:boolean
}

interface KeyBoardData {
    eventType: KeyBoardEventType,
    key: string
}

interface RTCdata {
    type: EventType,
    data: MouseData | ScreenData | MouseEventData | KeyBoardData
}

const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

export {
    StartStatus,
    ipPattern,
    RTCdata,
    MouseData,
    ScreenData,
    MouseEventData,
    KeyBoardData
}