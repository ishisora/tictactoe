const board = document.querySelector(".board");
const squares = document.querySelectorAll(".square");
const comment = document.querySelector(".comment");
const reset = document.querySelector(".reset");
const ws = new WebSocket(`ws://${hostname}:${port}`);

squares.forEach((square, index) => {
    square.addEventListener("click", (event) => {
        handleSquareClick(event, index);
    });
});

reset.addEventListener("click", () => {
    handleResetClick()
});

let player = "";

function judge() {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        const [aa, bb, cc] = [squares[a].textContent, squares[b].textContent, squares[c].textContent];
        if (aa && aa === bb && aa === cc) {
            if (aa == "o") {
                comment.textContent += "先行の勝利";
            } else {
                comment.textContent += "後攻の勝利";
            }
            squares.forEach((square) => {
                square.removeEventListener("click", handleSquareClick);
            });
            return;
        }
    }
    let cnt = 0;
    squares.forEach((square) => {
        if (square.textContent) cnt++;
    });
    if (cnt === 9) {
        comment.textContent += "引き分け";
        squares.forEach((square) => {
            square.removeEventListener("click", handleSquareClick);
        });
    }
}

function handleSquareClick(event, index) {
    console.log(squares[index]);

    // WebSocketサーバーとの通信
    const json = JSON.stringify({ type: 'playing', index: index, player: player });
    ws.send(json);

    console.log(`send: ${player}`);
}

function handleResetClick() {
    // WebSocketサーバーとの通信
    const json = JSON.stringify({ type: 'reset' });
    ws.send(json);

    console.log(`send: ${player}`);
}

ws.addEventListener('open', () => {
    console.log('Connected to server');
});

ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log(`Received: ${JSON.stringify(message)}`);
    switch (message.type) {
        case 'init':
            player = message.message;
            console.log(`init: ${player}`);
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
            judge();
            break;
        case 'reset':
            squares.forEach((square) => {
                square.textContent = "";
                square.classList.remove("o");
                square.classList.remove("x");
                comment.textContent = "Result: ";
            });
            break;
    }
});

ws.addEventListener('close', () => {
    console.log('Connection closed');
});
