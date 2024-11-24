const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.ejs', { title: 'tictactoe' });
});

router.use('/tictactoe', require('./tictactoe.js'));
router.use('/websocket', require('./websocket.js'));

module.exports = router;
