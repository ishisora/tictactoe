const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function (req, res, next) {
    req.session.userId = uuidv4();
    console.log(`cookiedebug: ${req.session.userId}`);
    res.render('index.ejs', { title: 'tictactoe' });
});

router.use('/tictactoe', require('./tictactoe.js'));
router.use('/websocket', require('./websocket.js'));

module.exports = router;
