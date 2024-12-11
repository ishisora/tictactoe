const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.userId) {
        req.session.userId = uuidv4();
        console.log(`cookiedebug1: ${JSON.stringify(req.session)} `);
    } else {
        console.log(`cookiedebug2: ${JSON.stringify(req.session)} `);
    }
    res.render('index.ejs', { title: 'tictactoe', session: req.session.userId });
});

router.use('/tictactoe', require('./tictactoe.js'));
router.use('/websocket', require('./websocket.js'));

module.exports = router;
