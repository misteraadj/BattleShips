var express = require('express');
var router = express.Router();

/* Get splash screen at root. */
router.get("/", function(req, res) {
  res.sendFile("splash.html", {root: "./public"});
});


/* Pressing the 'PLAY' button, returns this page. COPIED FROM COURSE EXAMPLE CODE*/
router.get("/play", function(req, res) {
  res.sendFile("game.html", {root: "./public"});
});

module.exports = router;
