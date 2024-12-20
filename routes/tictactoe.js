const express = require('express');
const router = express.Router();
const { hostname, port } = require('../config/config');

/* GET home page. */
router.get('/', function (req, res, next) {
    const rooms = require('../service/rooms.js');
    const userToRoom = require('../service/users.js');
    const room = userToRoom.get(req.session.userId);
    if (!req.session.userId) {
        res.redirect('/');
    } else if (rooms[room].players.x.ws === "") {
        res.render('wait.ejs', { title: 'tictactoe', hostname: hostname, port: port });
    } else {
        res.render('tictactoe.ejs', { title: 'tictactoe', hostname: hostname, port: port });
    }
});

module.exports = router;
