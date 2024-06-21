import { desktopCapturer } from 'electron'

async function CatchDeskTopSourceId() {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    return sources[0].id
}

export {
    CatchDeskTopSourceId
}