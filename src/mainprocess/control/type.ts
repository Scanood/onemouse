enum EventType {
    MOUSE = 'mouse',
    MOUSEEVENT = 'mouseevent',
    KEYBOARD = 'keyboard',
    SCREEN = 'screen'
}

enum ActionType {
    PRESS = 'press',
    RELEASE = 'release',
    WHEEL = 'wheel'
}

enum ActionKey {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
    SCROLLUP = 3,
    SCROLLDOWN = 4
}
enum KeyBoardEventType {
    KEYDOWN = 'keydown',
    KEYUP = 'keyup'
}

interface MouseData {
    x: number,
    y: number
}
export {
    EventType,
    MouseData,
    ActionType,
    ActionKey,
    KeyBoardEventType
}