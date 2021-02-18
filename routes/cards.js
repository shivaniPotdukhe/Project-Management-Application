const express = require('express');
let router = express.Router();
const mysqlConnection = require("../connection");
const CardsController = require("../controllers/cards");
const UserController = require("../controllers/users");

// get all the cards which are not deleted
router.get("/", function(req,res) {
    CardsController.getCards(req,res);
});

// create new card
router.post("/", function(req,res) {
    CardsController.createCard(req,res);
});

// delete a card
router.delete("/",function(req,res) {
    CardsController.deleteCard(req,res);
});

// update a card
router.put("/",function(req,res) {
    CardsController.updateCard(req,res);
});

// assign card to user
router.post("/assign/", function(req,res) {
    UserController.assignCardToUser(req,res);
});

// unassign the card which was assigned to some user
router.post("/unassign/", function(req,res) {
    UserController.unAssignCard(req,res);
});

module.exports = router;