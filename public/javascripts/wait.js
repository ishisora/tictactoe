const messageElement = document.querySelector('#message');
const ws = new WebSocket(`ws://${hostname}:${port}`);

ws.addEventListener('open', () => {
    console.log('Connected to server');
    // waitからの接続だと伝える。
    // WebSocketサーバーとの通信
    const json = JSON.stringify({ type: 'wait' });
    ws.send(json);
});

ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log(`Received: ${JSON.stringify(message)}`);
    switch (message.type) {
        case 'wait':
            console.log(`wait: `);
            messageElement.textContent = "マッチング待機中。対戦相手を探しています。";
            break;
        case 'match':
            messageElement.textContent = "マッチングしました。まもなくゲームを開始します。";
            setTimeout(() => {
                window.location.href = '/tictactoe';
            }, 3000); // 3秒後にゲーム画面に遷移
            break;
    }
});

ws.addEventListener('close', () => {
    console.log('Connection closed');
});
