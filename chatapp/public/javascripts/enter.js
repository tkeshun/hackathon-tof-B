'use strict';

// サーバから受信した入室メッセージを画面上に表示する
socket.on('enterOtherEvent', function (data) {
    $('#thread').prepend('<p>' +data + 'が入室しました'+ '</p>');
});
