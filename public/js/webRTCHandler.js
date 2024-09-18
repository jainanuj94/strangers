import * as wss from './wss.js'
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as store from './store.js';

let connectedUserDetails;
let peerConnection;

const defaultConstraints = {
    audio: true,
    video: true
}
const configuration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:13902"
        }
    ]
}
export const getLocalPreview = () => {
    navigator.mediaDevices.getUserMedia(defaultConstraints)
        .then((stream) => {
            console.log(stream);
            ui.updateLocalVideo(stream);
            store.setLocalStream(stream);
        }).catch((err) => {
            console.log("error occurred when trying to get an access to camera", err);
    });
}

export const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (events) => {
        console.log("getting ice candidates from stun server", events);
        if(events.candidate){
            // send out ice candidates to other peer
            wss.sendDataUsingWebRTCSignaling({
                connectedUserSocketId: connectedUserDetails.socketId,
                type: constants.webRTCSignaling.ICE_CANDIDATE,
                candidate: events.candidate
            })
        }
    }

    peerConnection.onconnectionstatechange = (events) => {
        if (peerConnection.connectionState === "connected"){
            console.log("successfully connected with other peer", events);
        }
    }

    // receiving tracks
    const remoteStream = new MediaStream();
    store.setRemoteStream(remoteStream);
    ui.updateRemoteVideo(remoteStream);

    peerConnection.ontrack = (events) => {
        remoteStream.addTrack(events.track);
    }

    // add out stream to peer connection
    if (connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE){
        const localStream = store.getState().localStream;

        for(const track of localStream.getTracks()){
            peerConnection.addTrack(track, localStream);
        }
    }
}
export const sendPreOffer = (callType, calleePersonalCode) => {
    connectedUserDetails = {
        callType,
        socketId: calleePersonalCode
    }

    if (callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE){
        const data = {
            callType, calleePersonalCode
        }
        wss.sendPreOffer(data);
        ui.showCallingDialog(callingDialogRejectCallHandler);
    }
}

export const handlePreOffer = (data) => {
    console.log("pre-offer-came", data);
    const { callType, callerSocketId } = data;

    connectedUserDetails = {
        socketId: callerSocketId,
        callType
    }

    if (callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE){
        ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
    }
}
const sendPreOfferAnswer = (preOfferAnswer) => {
    const data = {
        callerSocketId : connectedUserDetails.socketId,
        preOfferAnswer
    }

    ui.removeAllDialogs();
    wss.sendPreOfferAnswer(data);
}

export const handlePreOfferAnswer = (data) => {
    const { preOfferAnswer } = data;
    ui.removeAllDialogs();
    console.log(preOfferAnswer)
    if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND){
        // show dialog callee not found
        ui.showInfoDialog(preOfferAnswer);
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE){
        // show dialog callee not available
        ui.showInfoDialog(preOfferAnswer);
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED){
        // show dialog callee rejected
        ui.showInfoDialog(preOfferAnswer);
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED){
        // send webRTC offer
        ui.showCallElements(connectedUserDetails.callType);
        createPeerConnection();
        sendWebRTCOffer();
    }
}

export const sendWebRTCOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.OFFER,
        offer: offer
    });
}

export const handleWebRTCOffer = async (data) => {
    createPeerConnection()
    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer);
    wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ANSWER,
        answer: answer
    })
}

export const handleWebRTCAnswer = async (data) => {
    await peerConnection.setRemoteDescription(data.answer);
}

export const handleWebRTCCandidate = async (data) => {
    try{
        await peerConnection.addIceCandidate(data.candidate);
    }catch (err){
        console.error("error occurred when trying to add ice candidate", err);
    }
}
const acceptCallHandler = () => {
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
    ui.showCallElements(connectedUserDetails.callType);
}

const rejectCallHandler = () => {
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const callingDialogRejectCallHandler = () => {
    console.log("rejecting call")
}