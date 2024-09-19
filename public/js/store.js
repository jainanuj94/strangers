import * as constants from "./constants.js";
let state = {
    socketId: null,
    localStream: null,
    remoteStream: null,
    screenSharingStream: null,
    allowConnectionsFromStrangers: false,
    screenSharingActive: false,
    callState : constants.callState.CALL_AVAILABLE_ONLY_CHAT,
};

export const setSocketId = (socketId) => {
    state = {
        ...state,
        socketId
    }
};

export const setCallState = (callState) => {
    state = {
        ...state,
        callState
    }
};

export const setLocalStream = (localStream) => {
    state = {
        ...state,
        localStream
    }
};

export const setRemoteStream = (remoteStream) => {
    state = {
        ...state,
        remoteStream
    }
};

export const setScreenSharingStream = (screenSharingStream) => {
    state = {
        ...state,
        screenSharingStream
    }
};

export const setAllowConnectionsFromStrangers = (allowConnectionsFromStrangers) => {
    state = {
        ...state,
        allowConnectionsFromStrangers
    }
};

export const setScreenSharingActive = (screenSharingActive) => {
    state = {
        ...state,
        screenSharingActive
    }
};

export const getState = () => state;