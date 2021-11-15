'use strict';

const peerConnectionMap = new Map();
let stream;

(async function init(){
    stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true}).catch(window.alert);
    document.getElementById('local').srcObject = stream;
})()

// 通話要求を発行する関数
function callme(){
    socket.emit('callme', {});
    console.log("start webrtc");
}

// PeerConnectionを生成する関数
function newPeerConnection(socketID){
    // PeerConnectionの生成
    let pc = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com"
            }
        ]
    });

    // onICECandidateの登録
    pc.onicecandidate = function (e) {
        // ICECandidateを送信する
        socket.emit("sendICECandidateEvent", {
            ICECandidate: e.candidate,
            to: socketID
        });
    };

    // onTrackの登録
    pc.ontrack = function(e) {
        // オーディオTrackの場合は終了
        if (e.track.kind === 'audio'){
            return;
        }

        // Videoエレメントを作成
        const remoteVideo = document.createElement(e.track.kind);
        remoteVideo.id = socketID;
        remoteVideo.srcObject = e.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.controls = false;

        document.getElementById('remote').appendChild(remoteVideo);
    };

    return pc;
}

// 全てのPeerConnectionにTrackを追加する関数
function setTrack(track){
    peerConnectionMap.forEach(pc=>{
        pc.addTrack(track);
    })
}

// 通話要求を受け取った時のハンドラ
socket.on('callme', async function(data){
    // OfferSDPの送り先を登録
    data.to = data.from;
    // PeerConnectionを生成
    const pc = await newPeerConnection();
    stream.getTracks.forEach(track => {
        pc.addTrack(track, stream);
    });

    // PeerConnectionをOfferSDP送信元のIDと紐付けて登録
    peerConnectionMap.set(data.from, pc);
    // OfferSDPを生成
    const localSdp = await pc.createOffer().catch(e => e);
    data.OfferSDP = localSdp;

    socket.emit('sendOfferSDPEvent', data);
});

// OfferSDPを受け取った時のハンドラ
socket.on('receiveOfferSDPEvent', async function(data) {
    // AnswerSDPの送り先を登録
    data.to = data.from;
    
    // PeerConnectionを生成
    const pc = newPeerConnection(data.from);
    stream.getTracks.forEach(track => {
        pc.addTrack(track, stream);
    });

    peerConnectionMap.set()
    // RemoteSDPを登録
    await pc.setRemoteDescription(data.sdp);
    // LocalSDPを生成
    const localSdp = await pc.createAnswer();
    // LocalSDPを登録
    await pc.setLocalDescription(localSdp);
    // dataにAnswerSDPを登録
    data.AnswerSDP = localSdp;

    socket.emit('sendAnswerSDPEvent', data);
});

// AnswerSDPを受け取った時のハンドラ
socket.on('receiveAnswerSDPEvent', function (data) {
    // 送信元と紐づけられたPeerConnectionを取得
    const pc = peerConnectionMap.get(data.from);
    // 相手のAnswerSDPを登録
    pc.setRemoteDescription(data.AnswerSDP);
});

// ICECandidateを受け取った時のハンドラ
socket.on('receiveICECandidateEvent', function(data){
    // 送信元と紐付けられたPeerConnectionを取得
    const pc = peerConnectionMap.get(data.from);

    // 取得したPeerConnectionにICECandidateを登録
    pc.addIceCandidate(data.ICECandidate);
});
