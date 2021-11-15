'use strict';

module.exports = function (socket) {
    // ビデオ通話開始要求を送信する
    socket.on('callme', function(data){
        data.from = socket.id;
        socket.broadcast.emit('callme', data);
    });

    // SDPを送信する
    socket.on('sendOfferSDPEvent', function (data) {
        data.from = socket.id;
        socket.to(data.to).emit('receiveOfferSDPEvent', data);
    });

    // ICECandidateを送信する
    socket.on('sendICECandidateEvent', function (data) {
        data.from = socket.id;
        socket.to(data.to).emit('receiveICECandidateEvent', data);
    });

    socket.on('sendAnswerSDPEvent', function (data) {
        data.from = socket.id;
        socket.to(data.to).emit('receiveAnswerSDPEvent', data);
    });
};