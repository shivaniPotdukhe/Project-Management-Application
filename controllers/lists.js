const database = "ProjectManagement";
const tableName = "lists";
const mysqlConnection = require("../connection");
const apiResponse = require("../helper/apiResponse");
const CardsController = require('./cards');

/**
 * Create List
 */
exports.createList = async (req, res) =>  {
    try {

    const { name, board_id } = req.body;
    console.log('createList::name:: ', name);
    console.log('createList::board_id:: ', board_id);
    const sqlQuery = `Insert into ${database}.${tableName} (name, board_id)values ('${name}', ${board_id});`

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
        console.log('createList::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.listDelete = (ids) => {
    const { id, board_id} = ids;
    return new Promise(function (resolve, reject) {
        let sqlQuery = `Delete from ${database}.${tableName}`;

        // either id / board_id will be input
        if(id) {
            sqlQuery += ` where id = '${id}'`;
        }
        if(board_id) {
            sqlQuery += ` where board_id = '${board_id}'`;
        }
        console.log('sqlQuery:: ', sqlQuery);

        mysqlConnection.query(sqlQuery,(err, result) => {
            resolve({err, result});
        });
    });
}

/**
 * Delete List
 */
exports.deleteList = async (req,res) => {
    try {
        const { id } = req.body;
        console.log('deleteList::id:: ', id);

        // delete all cards of the corresponding list
        const cardDeleteResponse = await CardsController.cardDelete( { lists_id: id });

        if(cardDeleteResponse.err) {
            return apiResponse.ErrorResponse(res, cardDeleteResponse.err.sqlMessage);
        }

        const response = await this.listDelete( { id });

        if(response.err) {
            return apiResponse.ErrorResponse(res, response.err.sqlMessage);
        }
        else{
            return apiResponse.successResponse(res, `List with id: ${id} deleted sussessfully!`);
        }

    } catch (error) {
         //throw error in json response with status 500.
         console.log('deleteList::error:: ', error);
         return apiResponse.ErrorResponse(res, error);
    }
}

/**
 * Update name of the List
 */
exports.updateList = async (req, res) =>  {
    try {

    const { id, name } = req.body;
    console.log('updateList::id:: ', id);
    console.log('updateList::name:: ', name);

    const sqlQuery = `Update ${database}.${tableName} set name = '${name}' where id = ${id};`

        mysqlConnection.query(sqlQuery,(err, result) => {
            if(err) {
                return apiResponse.ErrorResponse(res, err.sqlMessage);
            }
            else{
                return apiResponse.successResponseWithData(res, { id, name });
            }
        });

    } catch (error) {
        //throw error in json response with status 500.
        console.log('updateList::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};

/**
 * Get lists of specified board
 * returns - This method returns lists of the specified board and if board_id is not specified then it returns all the lists.
 */
exports.getLists = async (req,res) => {
    try {
        const { board_id } = req.body;
        let sqlQuery = `Select * from ${database}.${tableName}`;

        if(board_id){
            sqlQuery += ` where board_id = ${board_id};`;
        }else{
            sqlQuery += ';';
        }
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