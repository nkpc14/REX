import Peer from 'simple-peer';

let socket = io('http://localhost:80/rtc');

const WebRTC = {
    stream: null,
    localVideo: null,
    remoteVideo: null,
    client: {},


    // Getting media permissions
    getMedia() {
        console.log("Getting Media");
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(WebRTC.videoStreamHandler).catch(WebRTC.handleError)
    },

    initPeer(type) {
        let peer = new Peer({
            initiator: (type === 'init'),
            stream: this.stream,
            trickle: false
        });
        // If we get the stream from another user
        peer.on('stream', function (stream) {
            console.log("Got Stream from other end");
            WebRTC.createVideo(stream)
        });

        // If we want to close the connection
        peer.on('close', function () {
            console.log("Removing remote Video");
            WebRTC.remoteVideo.remove();
            peer.destroy();
        });
        return peer;
    }
    ,

    // This user will send offer to other user
    createPeer() {
        WebRTC.client.gotAnswer = false;
        let peer = WebRTC.initPeer('init');
        peer.on('signal', (data) => {
            if (!WebRTC.client.gotAnswer) {
                if(!WebRTC.client.gotAnswer){
                    console.log("Sending Offer");
                    socket.emit('offer', data);
                }
            }
        });
        WebRTC.client.peer = peer;
    }
    ,

    // This will to answer to the offer
    answerToOffer(offer) {
        let peer = WebRTC.initPeer('notInit');
        console.log("Offer Received!");
        peer.on('signal', (data) => {
            console.log("Sending Answer to Offer");
            socket.emit('answer', data);
        })
        peer.signal(offer);
        WebRTC.client.peer = peer;
    },

    // Answer coming from backend here both clients will be connected finally
    answerToVideoCall(answer) {
        console.log("Answering to call");
        WebRTC.client.gotAnswer = true;
        let peer = WebRTC.client.peer;

        // Here we are manually signaling on line 61
        console.log("Sending Answer Signal")
        console.log(answer);
        peer.signal(answer);
    },

    // When we receive stream from other user
    createVideo(stream){
        console.log("Remote Stream Active");
        WebRTC.remoteVideo.srcObject = stream;
        WebRTC.remoteVideo.play();
    },



    //Local Video stream handler
    videoStreamHandler(stream) {
        if (stream) {
            console.log("Local Stream")
            console.log("Sending Add New Client");
            socket.emit('addNewClient');
            console.log("My Socket Id is: ", socket.id);
            WebRTC.localVideo.srcObject = stream;
            WebRTC.localVideo.play();
            console.log("Local Stream Active")
            // WebRTC.createPeer(stream);
        }
    }
    ,
    setLocalVideo(id) {
        WebRTC.localVideo = element(id);
    }
    ,

    setRemoteVideo(id) {
        WebRTC.remoteVideo = element(id);
    }
    ,

// This method is for screen sharing
    handleDisplayStream(stream) {
        if (stream) {
            socket.emit('addClient');
            let holder = document.getElementById('displays');
            let video = document.createElement('video');
            video.onloadedmetadata = (e) => video.play();
            video.srcObject = stream;
            holder.appendChild(video);
        }
    }
    ,

    handleError(error) {
        console.log(error);
    }
};


window.onload = function () {
    document.getElementById('button').addEventListener('click', function () {
        WebRTC.setLocalVideo('localVideo');
        WebRTC.setRemoteVideo('remoteVideo');
        WebRTC.getMedia();
    })
};

// Server side socket management
socket.on('createPeer', WebRTC.createPeer);
socket.on('offer', WebRTC.answerToOffer);
socket.on('answer', WebRTC.answerToVideoCall);

// Helper Method
const element = (id) => {
    return document.getElementById(id);
};

