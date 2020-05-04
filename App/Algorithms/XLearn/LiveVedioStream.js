import { getIo } from "../../../Server/Sockets/Socket";
class LiveVideoStream{
    constructor(){
        this.io = getIo();
        this.io.on('offer',this.sendOffer);
        this.io.on('answer',this.sendAnswer);
        // this.io.on('addClient');
        this.io.on('close',this.disconnect);
    }

    sendOffer(offer){
        this.io.broadcast.emit('backendOffer',offer);
    }

    sendAnswer(data){
        this.io.broadcast.emit('backendAnswer',data);
    }

    sendMessage(){

    }

    receiveMessage(){

    }

    disconnect(){

    }

}