const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// room のテンプレート
const room = {
    players: {
        o: {
            id: "",
            ws: "",
        },
        x: {
            id: "",
            ws: "",
        },
    },
    states: {
        state: 'wait',
        squares: ['', '', '', '', '', '', '', '', ''],
        nowPlayer: 'o',
    }
};

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.userId) {
        req.session.userId = uuidv4();
        console.log(`cookiedebug1: ${JSON.stringify(req.session)} `);
    } else {
        console.log(`cookiedebug2: ${JSON.stringify(req.session)} `);
    }
    res.render('index.ejs', { title: 'tictactoe', message: '' });
});

router.post('/', function (req, res, next) {
    if (!req.session.userId) {
        req.session.userId = uuidv4();
    }
    const keyword = req.body.keyword;
    //console.log(`mathingdebug1: ${keyword} `);

    let rooms = require('../service/rooms.js');
    console.log(room);
    let userToRoom = require('../service/users.js');
    if (!(keyword in rooms)) { // あいことば(keyword)がroomsにない場合
        rooms[keyword] = room;
        rooms[keyword].players.o.id = req.session.userId;
        userToRoom.set(req.session.userId, keyword);
        res.redirect('/tictactoe');
    } else if (rooms[keyword].players.x.id === "" && rooms[keyword].players.o.id !== req.session.userId) { // keywordのroomsがあって、xがまだなくて、sessionがoと異なる場合
        rooms[keyword].players.x.id = req.session.userId;
        userToRoom.set(req.session.userId, keyword);
        console.log(`ZZZ matchingdebug2: ${rooms[keyword].players.x}`);
        res.redirect('/tictactoe');
    } else {
        res.render('index.ejs', { title: 'tictactoe', message: 'あいことばは既に使われています。他のあいことばを使用してください。' });
    }
    //console.log(`roomsdebug1: ${JSON.stringify(rooms)}`);
    //console.log(`usersdebug1: ${JSON.stringify(users)}`);
});

router.use('/tictactoe', require('./tictactoe.js'));

module.exports = router;
