const elementBoard = document.querySelector(".board");
const elementSquares = document.querySelectorAll(".square");
const elementComment = document.querySelector(".comment");
const elementReset = document.querySelector(".reset");
const ws = new WebSocket('ws://localhost:3000');

ws.addEventListener('open', () => {
    console.log('Connected to server');
});

ws.addEventListener('message', (event) => {
    console.log(event.data);
    const square = event.data;
    if (square.textContent == "") {
        if (player == "o") {
            square.textContent = "o"
            square.classList.add("o");
            player = "x";
        } else {
            square.textContent = "x"
            square.classList.add("x");
            player = "o";
        }
    }
    judge();
});

ws.addEventListener('close', () => {
    console.log('Connection closed');
});

elementSquares.forEach((square) => {
    square.addEventListener("click", handleSquareClick);
});
elementReset.addEventListener("click", handleResetClick);

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
        const [aa, bb, cc] = [elementSquares[a].textContent, elementSquares[b].textContent, elementSquares[c].textContent];
        if (aa && aa === bb && aa === cc) {
            if (aa == "o") {
                elementComment.textContent += "先行の勝利";
            } else {
                elementComment.textContent += "後攻の勝利";
            }
            elementSquares.forEach((square) => {
                square.removeEventListener("click", handleSquareClick);
            });
            return;
        }
    }
    let cnt = 0;
    elementSquares.forEach((square) => {
        if (square.textContent) cnt++;
    });
    if (cnt === 9) {
        elementComment.textContent += "引き分け";
        elementSquares.forEach((square) => {
            square.removeEventListener("click", handleSquareClick);
        });
    }
}

function handleSquareClick(event) {
    const square = event.target;
    console.log(square);
    if (square.textContent == "") {
        if (player == "o") {
            square.textContent = "o"
            square.classList.add("o");
            player = "x";
        } else {
            square.textContent = "x"
            square.classList.add("x");
            player = "o";
        }
    }
    // WebSocketサーバーとの通信
    ws.send(square);
    console.log('send');
    judge();
}

function handleResetClick() {
    elementSquares.forEach((square) => {
        square.textContent = "";
        square.classList.remove("o");
        square.classList.remove("x");
        player = "o";
        elementComment.textContent = "Result: ";
        elementSquares.forEach((square) => {
            square.addEventListener("click", handleSquareClick);
        });
    });
}
