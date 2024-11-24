const WebSocket = require('ws');

function handleConnection(wsserver) {
    wsserver.on('connection', (socket) => {
        console.log('Client connected');

        socket.on('message', (data) => {
            console.log(`Received: ${data}`);

            wsserver.clients.forEach((client) => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });

        socket.on('close', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = handleConnection;
