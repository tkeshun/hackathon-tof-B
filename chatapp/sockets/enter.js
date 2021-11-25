'use strict';

module.exports = function (socket) {
    // 入室メッセージをクライアントに送信する
    socket.on('enterEvent', function (data) {
        socket.join(data.roomId);
        socket.broadcast.to(data.roomId).emit('enterOtherEvent',data);
    });
};
