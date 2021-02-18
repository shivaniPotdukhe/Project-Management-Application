const database = "ProjectManagement";
const tableName = "users";
const mysqlConnection = require("../connection");
const apiResponse = require("../helper/apiResponse");

/**
 * Create User
 */
exports.createUser = async (req, res) =>  {
    try {

    const { name, email } = req.body;

    console.log('createUser::name:: ', name);
    console.log('createUser::email:: ', email);

    const sqlQuery = `Insert into ${database}.${tableName} (name,email) values ('${name}', '${email}');`
        console.log('sqlQuery:: ', sqlQuery);
        mysqlConnection.query(sqlQuery,(err, result) => {
            if(err) {
                return apiResponse.ErrorResponse(res, err.sqlMessage);
            }
            else{
                return apiResponse.successResponseWithData(res, { name, email });
            }
        });

    } catch (error) {
        //throw error in json response with status 500.
        console.log('createCard::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};

/**
 * Get all the users
 * returns - This method returns users of the specified board
 * or returns users of the specified card
 * and if board_id/card_id is not specified then it returns all the users.
 */
exports.getUsers = async (req,res) => {
    try {
        const { board_id, card_id } = req.body;
        let sqlQuery = `Select * from ${database}.${tableName}`;

        if(board_id){
            sqlQuery += ` where board_id = ${board_id}`;
        }
        if(card_id) {
            sqlQuery += (board_id) ? ` and card_id = ${card_id};` : ` where card_id = ${card_id}`;
        }

        // append ;
        sqlQuery += ';';

        console.log('getLists::sqlQuery:: ', sqlQuery);

        mysqlConnection.query(sqlQuery,(err, result) => {
            if(err) {
                return apiResponse.ErrorResponse(res, err.sqlMessage);
            }
            else{
                return apiResponse.successResponseWithData(res, result);
            }
        });
    } catch (error) {
        //throw error in json response with status 500.
        console.log('getLists::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};

/**
 * checkIfuserExists - This method checks if user is present or not.
 * @param {String} email - The email of user.
 * retuns - This method returns true of user exists else returns false.
 */
function checkIfuserExists(email) {
    return new Promise(function (resolve, reject) {
        let response = false;
        const check_user = `select email from ${database}.users where email = '${email}';`;

        mysqlConnection.query(check_user, (err, result) => {
            if(err) {
                reject(err.sqlMessage);
            }
            else if (result.length == 0) {
                reject(`User with email: ${email} does not exits!`);
            }
            else if (result.length > 0) {
                resolve(true);
            }
        });
    });
  }

/**
 * Delete users
 * This method deletes user with specified email.
 */
exports.deleteUser = async (req,res) => {
    try {
        const { email } = req.body;
        console.log('deleteUser::email:: ', email);

        const foundUser = await checkIfuserExists(email);

        if(foundUser) {
            const sqlQuery = `Delete from ${database}.${tableName} where email = '${email}';`;
            console.log('deleteUser::sqlQuery:: ', sqlQuery);

            mysqlConnection.query(sqlQuery,(err, result) => {
                if(err) {
                    return apiResponse.ErrorResponse(res, err.sqlMessage);
                }
                else{
                    return apiResponse.successResponse(res, `User with email: ${email} deleted sussessfully!`);
                }
            });
        }

    } catch (error) {
         //throw error in json response with status 500.
         console.log('deleteUser::error:: ', error);
         return apiResponse.ErrorResponse(res, error);
    }
}

/**
 * Assign Card To User
 * This method assignes specified card to specified user
 * @param {Object} req.body - Contains id of card and email of user
 * @returns - This method returns message on sussessfull assign of card to user.
 */
exports.assignCardToUser = async (req,res) => {
    try {
        const { id, email } = req.body;

        const foundUser = await checkIfuserExists(email);

        if(foundUser) {
            const sqlQuery = `Update ${database}.${tableName} set card_id = ${id} where email = '${email}';`;
            console.log('assignCardToUser::sqlQuery:: ', sqlQuery);

            mysqlConnection.query(sqlQuery,(err, result) => {
                if(err) {
                    return apiResponse.ErrorResponse(res, err.sqlMessage);
                }
                else{
                    return apiResponse.successResponse(res, `The card with id: ${id} is assigned to user: ${email}.`);
                }
            });
        }

    } catch (error) {
        //throw error in json response with status 500.
         console.log('assignCardToUser::error:: ', error);
         return apiResponse.ErrorResponse(res, error);
    }
}


/**
 * Unassign Card
 * This method unassignes specified card for the specified user.
 * @param {Object} req.body - Contains id of card and email of user
 * @returns - This method returns message on sussessfull unassign of card.
 */
exports.unAssignCard = async (req,res) => {
    try {
        const { id, email } = req.body;

        const sqlQuery = `Update ${database}.${tableName} set card_id = null where email = '${email}';`;
        console.log('unAssignCard::sqlQuery:: ', sqlQuery);

        mysqlConnection.query(sqlQuery,(err, result) => {
            if(err) {
                return apiResponse.ErrorResponse(res, err.sqlMessage);
            }
            else{
                return apiResponse.successResponse(res, `The card with id: ${id} is unassigned.`);
            }
        });

    } catch (error) {
        //throw error in json response with status 500.
         console.log('unAssignCard::error:: ', error);
         return apiResponse.ErrorResponse(res, error);
    }
}

/**
 * Assign users on board
 * This method assignes specified users on specified board
 * @param {Object} req.body - Contains id of board and email of user
 * @returns - This method returns message on sussessfull assign of user on board.
 */
exports.assignUserOnBoard = async (req,res) => {
    try {
        const { id, email } = req.body;

        const foundUser = await checkIfuserExists(email);

        if(foundUser) {
            const sqlQuery = `Update ${database}.${tableName} set board_id = ${id} where email = '${email}';`;
            console.log('assignUserOnBoard::sqlQuery:: ', sqlQuery);

            mysqlConnection.query(sqlQuery,(err, result) => {
                if(err) {
                    return apiResponse.ErrorResponse(res, err.sqlMessage);
                }
                else{
                    return apiResponse.successResponse(res, `The user: ${email} is member of board: ${id}.`);
                }
            });
        }

    } catch (error) {
        //throw error in json response with status 500.
         console.log('assignUserOnBoard::error:: ', error);
         return apiResponse.ErrorResponse(res, error);
    }
}

/**
 * Unassign users from the board
 * This method unassignes specified user form the specified board.
 * @param {Object} req.body - Contains id of board and email of user
 * @returns - This method returns message on sussessfull unassign of user.
 */
exports.unassignUserFromBoard = async (req,res) => {
    try {
        const { id, email } = req.body;

        const sqlQuery = `Update ${database}.${tableName} set board_id = null where email = '${email}';`;
        console.log('unassignUserFromBoard::sqlQuery:: ', sqlQuery);

        mysqlConnection.query(sqlQuery,(err, result) => {
            if(err) {
                return apiResponse.ErrorResponse(res, err.sqlMessage);
            }
            else{
                return apiResponse.successResponse(res, `The user: ${email} is removed from the members list of board: ${id}.`);
            }
        });

    } catch (error) {
        //throw error in json response with status 500.
         console.log('unassignUserFromBoard::error:: ', error);
         return apiResponse.ErrorResponse(res, error);
    }
}