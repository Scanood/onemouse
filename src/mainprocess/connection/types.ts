enum Client {
    CANDIDATE = 'Client-Candidate',
    OFFER = 'Client-Offer',
    ANSWER = 'Client-Answer'
}

enum Server {
    CANDIDATE = 'Server-Candidate',
    OFFER = 'Server-Offer',
    ANSWER = 'Server-Answer'
}


enum ClientVideo {
    CANDIDATE = 'Client-Video-Candidate',
    OFFER = 'Client-Video-Offer',
    ANSWER = 'Client-Video-Answer'
}

enum ServerVideo {
    CANDIDATE = 'Server-Video-Candidate',
    OFFER = 'Server-Video-Offer',
    ANSWER = 'Server-Video-Answer'
}

enum Connection {
    NEW = 'New-Connection'
}

export {
    Server,
    Client,
    ClientVideo,
    ServerVideo,
    Connection
}