const express = require('express');
const router = express.Router();
const { hostname, port } = require('../config/config');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('tictactoe.ejs', { title: 'tictactoe', hostname: hostname, port: port });
});

module.exports = router;
