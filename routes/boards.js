const express = require('express');
let router = express.Router();
const mysqlConnection = require("../connection");
const BoardController = require('../controllers/board');
const UserController = require("../controllers/users");

// get lists of all the boards whic are not deleted
router.get("/", function(req,res) {
    BoardController.getBoards(req,res);
});

// create new board
router.post("/", function(req,res) {
    BoardController.createBoard(req,res);
});

// delete a board
router.delete("/",function(req,res) {
    BoardController.deleteBoard(req,res);
});

// assign members on board
router.post("/assign/", function(req,res) {
    UserController.assignUserOnBoard(req,res);
});

// unassign users from board
router.post("/unassign/", function(req,res) {
    UserController.unassignUserFromBoard(req,res);
});

module.exports = router;