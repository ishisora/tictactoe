const board = document.querySelector(".board");
const squares = document.querySelectorAll(".square");
const comment = document.querySelector(".comment");
const reset = document.querySelector(".reset");
const ws = new WebSocket('ws://localhost:3000');

squares.forEach((square, index) => {
    square.addEventListener("click", handleSquareClick(index));
});

reset.addEventListener("click", handleResetClick);

let player = "o";

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

function handleSquareClick(index) {
    console.log(squares[index]);
    //if (squares[index].textContent == "") {
    //    if (player == "o") {
    //        squares[index].textContent = "o"
    //        squares[index].classList.add("o");
    //        player = "x";
    //    } else {
    //        squares[index].textContent = "x"
    //        squares[index].classList.add("x");
    //        player = "o";
    //    }
    //}
    // WebSocketサーバーとの通信
    //const json = JSON.stringify({ type: 'init', message: i });
    const json = JSON.stringify({ type: 'playing', message: index });
    //ws.send(json);
    console.log(`send: ${index}`);
    //judge();
}

function handleResetClick() {
    squares.forEach((square) => {
        square.textContent = "";
        square.classList.remove("o");
        square.classList.remove("x");
        player = "o";
        comment.textContent = "Result: ";
        squares.forEach((square) => {
            square.addEventListener("click", handleSquareClick);
        });
    });
}

ws.addEventListener('open', () => {
    console.log('Connected to server');
});

ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log(`Received: ${JSON.stringify(message)}`);
    switch (message.type) {
        case 'init':
            console.log(`init: ${message.message}`);
            break;
        case 'playing':
            console.log(`playing: ${message.message}`);
            const i = message.message;
            if (squares[i].textContent == "") {
                if (player == "o") {
                    squares[i].textContent = "o"
                    squares[i].classList.add("o");
                    player = "x";
                } else {
                    squares[i].textContent = "x"
                    squares[i].classList.add("x");
                    player = "o";
                }
            }
            // WebSocketサーバーとの通信
            judge();
    }
});

ws.addEventListener('close', () => {
    console.log('Connection closed');
});
