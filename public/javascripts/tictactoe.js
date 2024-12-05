const board = document.querySelector(".board");
const squares = document.querySelectorAll(".square");
const comment = document.querySelector(".comment");
const reset = document.querySelector(".reset");
const ws = new WebSocket('ws://localhost:3000');

ws.addEventListener('open', () => {
    console.log('Connected to server');
});

ws.addEventListener('message', (event) => {
    console.log(`Received: ${event.data}`);
    const i = event.data;
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
});

ws.addEventListener('close', () => {
    console.log('Connection closed');
});

squares.forEach((square) => {
    square.addEventListener("click", handleSquareClick);
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

function handleSquareClick(event) {


    let i = -1;

    for (let j = 0; j < squares.length; j++) {
        if (squares[j] === event.target) {
            console.log(j);
            i = j;
        }
    }

    if (i === -1) {
        console.error('存在しないsquareへのアクセス')
        return;
    }

    console.log(squares[i]);
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
    ws.send(i);
    console.log(`send: ${i}`);
    judge();
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
