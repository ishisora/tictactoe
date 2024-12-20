const WebSocket = require('ws');
const rooms = require('../service/rooms.js');
const userToRoom = require('../service/users.js');

function createWebSocketServer(server, sessionMiddleware) {
    const wss = new WebSocket.Server({ server })

    wss.on('connection', (ws, req) => {
        console.log("wss.clients.size = ", wss.clients.size);
        console.log(`Client connected`);
        //console.log(`roomsdebug2: ${JSON.stringify(rooms)}`);
        //console.log(`userToRoomdebug2: ${JSON.stringify(userToRoom)}`);
        sessionMiddleware(req, {}, () => {
            if (!userToRoom.has(req.session.userId)) {
                console.log("req.session.userIdに対応するroomがない。");
                ws.close();
                return;
            }
            const room = userToRoom.get(req.session.userId);
            if (rooms[room].players.o.id === req.session.userId) {
                rooms[room].players.o.ws = ws;
            } else {
                rooms[room].players.x.ws = ws;
            }


            ws.addEventListener('error', console.error);

            ws.addEventListener('close', () => {
                console.log('Client disconnected');
            });

            ws.addEventListener('message', (event) => {
                console.log(`Received: ${JSON.stringify(event.data)}`);
                console.log("req.session = ", req.session);

                const message = JSON.parse(event.data);

                switch (message.type) {
                    case 'wait':
                        if (userToRoom.has(req.session.userId)) {
                            if (rooms[room].players.x.id == "") {
                                rooms[room].players.o.ws = ws;
                                if (rooms[room].players.o.id === req.session.userId) {
                                    player = 'o';
                                } else {
                                    player = 'x';
                                }
                                ws.send(JSON.stringify({ type: 'wait' }));
                            } else {
                                rooms[room].players.x.ws = ws;
                                let player = '';
                                if (rooms[room].players.o.id === req.session.userId) {
                                    player = 'o';
                                } else {
                                    player = 'x';
                                }
                                rooms[room].states.state = 'playing';
                                rooms[room].players.o.ws.send(JSON.stringify({ type: 'match' }));
                                rooms[room].players.x.ws.send(JSON.stringify({ type: 'match' }));
                            }
                        }
                        break;
                    case 'init':
                        if (rooms[room].players.o.id == req.session.userId) {
                            ws.send(JSON.stringify({ type: 'init', message: 'o', squares: rooms[room].states.squares }));
                        } else {
                            ws.send(JSON.stringify({ type: 'init', message: 'x', squares: rooms[room].states.squares }));
                        }
                        break;
                    case 'playing':
                        if (message.player === rooms[room].states.nowPlayer && rooms[room].states.squares[message.index] === '') {
                            rooms[room].states.squares[message.index] = message.player;
                            judge(room);
                            rooms[room].players.o.ws.send(JSON.stringify({ type: 'playing', message: message.index, squares: rooms[room].states.squares }));
                            rooms[room].players.x.ws.send(JSON.stringify({ type: 'playing', message: message.index, squares: rooms[room].states.squares }));

                            if (rooms[room].states.nowPlayer === 'o') {
                                rooms[room].states.nowPlayer = 'x';
                            } else {
                                rooms[room].states.nowPlayer = 'o';
                            }
                        }
                        break;
                    case 'reset':
                        rooms[room].players.o.ws.send(JSON.stringify({ type: 'reset' }));
                        rooms[room].players.x.ws.send(JSON.stringify({ type: 'reset' }));
                        rooms[room].states.squares = ['', '', '', '', '', '', '', '', ''];
                        rooms[room].states.nowPlayer = 'o';
                        break;
                    case 'finish':
                        rooms[room].players.o.ws.send(JSON.stringify({ type: 'finish', message: '相手がゲームを終了しました。' }));
                        rooms[room].players.x.ws.send(JSON.stringify({ type: 'finish', message: '相手がゲームを終了しました。' }));
                        break;
                }
            });
        });
    });
}

function judge(room) {
    // rooms[room].states.squaresでゲーム盤面の判定
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
        const [aa, bb, cc] = [rooms[room].states.squares[a], rooms[room].states.squares[b], rooms[room].states.squares[c]];
        if (aa && aa === bb && aa === cc) {
            if (aa == "o") {
                rooms[room].states.state = 'result';
                rooms[room].players.o.ws.send(JSON.stringify({ type: 'result', message: '結果: 先行の勝利' }));
                rooms[room].players.x.ws.send(JSON.stringify({ type: 'result', message: '結果: 先行の勝利' }));
            } else {
                rooms[room].states.state = 'result';
                rooms[room].players.o.ws.send(JSON.stringify({ type: 'result', message: '結果: 後攻の勝利' }));
                rooms[room].players.x.ws.send(JSON.stringify({ type: 'result', message: '結果: 後攻の勝利' }));
            }
            return;
        }
    }
    let cnt = 0;
    rooms[room].states.squares.forEach((square) => {
        if (square) cnt++;
    });
    if (cnt === 9) {
        rooms[room].states.state = 'result';
        rooms[room].players.o.ws.send(JSON.stringify({ type: 'result', message: '結果: 引き分け' }));
        rooms[room].players.x.ws.send(JSON.stringify({ type: 'result', message: '結果: 引き分け' }));
    }
}

module.exports = createWebSocketServer;
