import Socket from './SocketModel'
// This class will handle adding and removing a socket
let clients = 0;

//------------------------WebRTC----------------------------

const onConnectWebRTC = (io) => {
    io.of('/rtc').on('connect', (socket) => {
        console.log("Client connected to WebRTC");
        onAddNewClient(socket);
        onOffer(socket);
        onAnswer(socket);
        ondisconnect(socket);
    })
};

const onOffer = (socket) => {
    socket.on('offer', (offer) => {
        console.log("offer");
        socket.broadcast.emit("backOffer", offer)
    });
};

const onAddNewClient = (socket) => {
    socket.on('addNewClient', () => {
        console.log("addNewClient");
        if (clients < 3) {
            if (clients === 1) {
                socket.emit('createPeer')
            }
        } else
            socket.emit('sessionActive');
        clients++;
    });


};

const onAnswer = (socket) => {
    socket.on('answer', (data) => {
        console.log("answer");
        socket.broadcast.emit("backAnswer", data)
    });

};

const ondisconnect = (socket) => {
    socket.on('disconnect', () => {
        if (clients > 0) {
            if (clients <= 2)
                socket.broadcast.emit("Disconnect");
            clients--;
        }
    })
};

export default class SocketIdManager {
    constructor(io) {
        this.io = io;
    }

    onConnect() {
        this.io.on('connection', async (socket) => {
            const user = await Socket.findOne({
                userId: '5e91cc60dda2d53be8994036'
            });
            if (!user) {
                const socketDb = new Socket({
                    socketId: socket.id,
                    userId: '5e91cc60dda2d53be8994036', // HARD CODED FOR TESTING
                });
                await socketDb.save();
            } else {
                const socketDb = await Socket.findOneAndUpdate({
                    socketId: socket.id
                }, {
                    $set: {
                        socketId: null,
                    },
                }, {
                    new: true
                });
            }

        });
        onConnectWebRTC(this.io);
    }

    onDisconnect(socket) {
        socket.on('disconnect', async () => {
            console.log(socket.id);
            const socketDb = await Socket.findOneAndUpdate({
                socketId: socket.id
            }, {
                $set: {
                    socketId: null
                },
            }, {
                new: true
            });

            if (socketDb) {
                // console.log(socketDb);
                console.log("Disconnected!");
            }
        })
    }


}