const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { hostname, port } = require('../config/config');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.userId) {
        req.session.userId = uuidv4();
        console.log(`cookiedebug1: ${JSON.stringify(req.session)} `);
    } else {
        console.log(`cookiedebug2: ${JSON.stringify(req.session)} `);
    }
    res.render('index.ejs', { title: 'tictactoe', session: req.session.userId, message: '' });
});

router.post('/', function (req, res, next) {
    const keyword = req.body.keyword;
    console.log(`mathingdebug1: ${keyword} `);

    let rooms = require('../service/rooms.js');
    let users = require('../service/users.js');
    if (!(keyword in rooms)) { // keywordがroomsにない場合
        rooms[keyword] = {
            players: {
                o: req.session.userId,
                x: ""
            },
            states: {
                squares: ['', '', '', '', '', '', '', '', ''],
                nowPlayer: 'o',
            }
        };
        users[req.session.userId] = keyword;
        res.redirect('/tictactoe');
    } else if (rooms[keyword].players.x === "" && rooms[keyword].players.o !== req.session.userId) { // keywordがroomsにあって、xがまだなくて、sessionがoと異なる場合
        rooms[keyword].players.x = req.session.userId;
        users[req.session.userId] = keyword;
        console.log(`ZZZ matchingdebug2: ${rooms[keyword].players.x}`);
        res.redirect('/tictactoe');
    } else {
        res.render('index.ejs', { title: 'tictactoe', session: req.session.userId, message: 'あいことばは既に使われています。他のあいことばを使用してください。' });
    }
    console.log(`roomsdebug1: ${JSON.stringify(rooms)}`);
    console.log(`usersdebug1: ${JSON.stringify(users)}`);
});

router.use('/tictactoe', require('./tictactoe.js'));
router.use('/websocket', require('./websocket.js'));

module.exports = router;
