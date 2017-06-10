var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let apiUrl = process.env.API_URL;
  res.render('index', { apiUrl: apiUrl });
});

module.exports = router;
