'use strict';

module.exports = function (socket) {
    
    /*
    socket.on('joinRoomEvent', function (data) {
        socket.join(data);
})*/
    // 入室メッセージをクライアントに送信する
    socket.on('enterEvent', function (data) {
        socket.join(data[1]);
        socket.broadcast.to(data[1]).emit('enterOtherEvent',data);
        socket.broadcast.emit('enterOtherEvent',data);
        //socket.join(data[1]);
})};
