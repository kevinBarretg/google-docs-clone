const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
    },
})

io.on("connection", socket => {
    socket.on('get-document', documentId => {
        
        // load document
        const data = ""
        socket.join(documentId)
        socket.emit("load-document", data)

        // detect changes
        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
            console.log(delta)
        })
    })
    console.log('connected')
})