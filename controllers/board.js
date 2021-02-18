const database = "ProjectManagement";
const tableName = "boards";
const mysqlConnection = require("../connection");
const apiResponse = require("../helper/apiResponse");
const ListsController = require('./lists');

/**
 * Create Board
 */
exports.createBoard = async (req, res) =>  {
    try {

    const { name } = req.body;
    console.log('createBoard::name:: ', name);
    const sqlQuery = `Insert into ${database}.${tableName} (name) values ('${name}');`

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
        console.log('createTag::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};

/**
 * Delete board
 */
exports.deleteBoard = async (req,res) => {
    try {
        const { id } = req.body;
        console.log('deleteBoard::id:: ', id);

        // delete all lists of the corresponding board
        const response = await ListsController.listDelete( { board_id: id });

        if(response.err) {
            return apiResponse.ErrorResponse(res, response.err.sqlMessage);
        }

        const sqlQuery = `Delete from ${database}.${tableName} where id = '${id}';`;
        console.log('sqlQuery:: ', sqlQuery);

        mysqlConnection.query(sqlQuery,(err, result) => {
            if(err) {
                return apiResponse.ErrorResponse(res, err.sqlMessage);
            }
            else{
                return apiResponse.successResponse(res, `Board with id: ${id} deleted sussessfully!`);
            }
        });
    } catch (error) {
         //throw error in json response with status 500.
         console.log('deleteBoard::error:: ', error);
         return apiResponse.ErrorResponse(res, error);
    }
}

/**
 * Get all active boards
 */
exports.getBoards = async (req,res) => {
    try {
        const sqlQuery = `Select * from ${database}.${tableName};`;
        console.log('sqlQuery:: ', sqlQuery);

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
        console.log('getBoards::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};
