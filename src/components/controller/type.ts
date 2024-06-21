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

enum KeyBoardEventType {
    KEYDOWN = 'keydown',
    KEYUP = 'keyup'
}

enum ActionKey {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
    SCROLLUP = 3,
    SCROLLDOWN = 4
}

export {
    EventType,
    ActionType,
    ActionKey,
    KeyBoardEventType
}