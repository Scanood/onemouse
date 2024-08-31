import { desktopCapturer, session } from 'electron'

async function CatchDeskTopSourceId() {
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
            callback({ video: sources[0], audio: 'loopback' })
        })
    })
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    return sources[0].id
}

export {
    CatchDeskTopSourceId
}