const board = document.querySelector(".board");
const squares = document.querySelectorAll(".square");
const comment = document.querySelector(".comment");
const reset = document.querySelector(".reset");
const finish = document.querySelector(".finish");
const ws = new WebSocket(`ws://${hostname}:${port}`);

for (const square of squares) {
    square.addEventListener("click", handleSquareClick);
}

let player = "";

function handleSquareClick(event) {
    const index = Array.from(squares).indexOf(event.target);
    console.log(squares[index]);

    // WebSocketサーバーとの通信
    const json = JSON.stringify({ type: 'playing', index: index, player: player });
    ws.send(json);

    console.log(`send: ${JSON.stringify(json)}`);
}

function handleResetClick() {
    // WebSocketサーバーとの通信
    const json = JSON.stringify({ type: 'reset' });
    ws.send(json);

    console.log(`send: ${player}`);
}

function handleFinishClick() {
    // WebSocketサーバーとの通信
    const json = JSON.stringify({ type: 'finish' });
    ws.send(json);

    console.log(`send: ${player}`);
}

ws.addEventListener('open', () => {
    console.log('Connected to server');
    // tactactoeからの接続だと伝える。
    // WebSocketサーバーとの通信
    const json = JSON.stringify({ type: 'init', player: player });
    ws.send(json);
});

ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log(`Received: ${JSON.stringify(message)}`);
    switch (message.type) {
        case 'init':
            player = message.message;
            console.log(`init: ${player}`);
            for (let i = 0; i < message.squares.length; i++) {
                if (message.squares[i] == "o") {
                    squares[i].textContent = "o"
                    squares[i].classList.add("o");
                } else if (message.squares[i] == "x") {
                    squares[i].textContent = "x"
                    squares[i].classList.add("x");
                }
            }
            break;
        case 'playing':
            console.log(`playing: ${message.message}`);
            for (let i = 0; i < message.squares.length; i++) {
                if (message.squares[i] == "o") {
                    squares[i].textContent = "o"
                    squares[i].classList.add("o");
                } else if (message.squares[i] == "x") {
                    squares[i].textContent = "x"
                    squares[i].classList.add("x");
                }
            }
            break;
        case 'result':
            comment.textContent += message.message;
            squares.forEach((square) => {
                square.removeEventListener("click", handleSquareClick);
            });
            reset.style.display = "block";
            reset.addEventListener("click", handleResetClick);
            finish.style.display = "block";
            finish.addEventListener("click", handleFinishClick);
            break;
        case 'reset':
            reset.removeEventListener("click", handleResetClick);
            finish.removeEventListener("click", handleFinishClick);
            squares.forEach((square) => {
                square.textContent = "";
                square.classList.remove("o");
                square.classList.remove("x");
                comment.textContent = "";
            });
            for (const square of squares) {
                square.addEventListener("click", handleSquareClick);
            }
            break;
        case 'finish':
            comment.textContent = message.message;
            reset.removeEventListener("click", handleResetClick);
            finish.removeEventListener("click", handleFinishClick);
            reset.style.display = "none";
            finish.style.display = "none";
            break
    }
});

ws.addEventListener('close', () => {
    console.log('Connection closed');
});
