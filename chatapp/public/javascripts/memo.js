'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val().replace(/\r?\n/g, '<br>');
    // メモの内容を表示
    $('#thread').prepend('<p>' + userName + 'さんのメモ：' + message + '</p>');
    $('#message').val('');

    return false;
}
