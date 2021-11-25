'use strict';

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val()
    document.cookie = "updateUserDate=こんにちは";  // "hakkeyoi=のここった"

    // ユーザ名が未入力でないかチェックする
    if (userName !== ''){
        socket.emit('enterEvent', userName);
        $('form').submit();
    }else{
        alert("ユーザ名を入力してください");
    }
}
