const express = require('express');
let router = express.Router();
const mysqlConnection = require("../connection");
const ListsController = require('../controllers/lists');

// get all the lists  which are not deleted
router.get("/", function(req,res) {
    ListsController.getLists(req,res);
});

// create new list
router.post("/", function(req,res) {
    ListsController.createList(req,res);
});

// delete a list
router.delete("/",function(req,res) {
    ListsController.deleteList(req,res);
});

// update a list
router.put("/",function(req,res) {
    ListsController.updateList(req,res);
});

module.exports = router;