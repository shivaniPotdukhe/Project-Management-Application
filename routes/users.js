const express = require('express');
let router = express.Router();
const mysqlConnection = require("../connection");
const UsersController = require("../controllers/users");

// get all the users
router.get("/", function(req,res) {
    UsersController.getUsers(req,res);
});

// create new user
router.post("/", function(req,res) {
    UsersController.createUser(req,res);
});

// delete a user
router.delete("/",function(req,res) {
    UsersController.deleteUser(req,res);
});

module.exports = router;