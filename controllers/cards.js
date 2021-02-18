const database = "ProjectManagement";
const tableName = "cards";
const mysqlConnection = require("../connection");
const apiResponse = require("../helper/apiResponse");

/**
 * Create Card
 */
exports.createCard = async (req, res) =>  {
    try {

    const { name, description, lists_id } = req.body;
    console.log('createCard::name:: ', name);
    console.log('createCard::description:: ', description);
    console.log('createCard::lists_id:: ', lists_id);

    const sqlQuery = `Insert into ${database}.${tableName} (name, description, lists_id) values ('${name}', '${description}', ${lists_id});`

        mysqlConnection.query(sqlQuery,(err, result) => {
            if(err) {
                return apiResponse.ErrorResponse(res, err.sqlMessage);
            }
            else{
                return apiResponse.successResponseWithData(res, { name, description, lists_id });
            }
        });

    } catch (error) {
        //throw error in json response with status 500.
        console.log('createCard::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.cardDelete = (ids) => {
    const { id, lists_id } = ids;
    return new Promise(function (resolve, reject) {
        let sqlQuery = `Delete from ${database}.${tableName}`;

        // either id / lists_id will be input
        if(id) {
            sqlQuery += ` where id = '${id}'`;
        }
        if(lists_id) {
            sqlQuery += ` where lists_id = '${lists_id}'`;
        }
        console.log('sqlQuery:: ', sqlQuery);

        mysqlConnection.query(sqlQuery,(err, result) => {
            resolve({err, result});
        });
    });
}

/**
 * Delete board
 */
exports.deleteCard = async (req,res) => {
    try {
        const { id } = req.body;
        console.log('deleteCard::id:: ', id);

        const response = await this.cardDelete( { id });

        if(response.err) {
            return apiResponse.ErrorResponse(res, response.err.sqlMessage);
        }
        else{
            return apiResponse.successResponse(res, `Card with id: ${id} deleted sussessfully!`);
        }
    } catch (error) {
         //throw error in json response with status 500.
         console.log('deleteCard::error:: ', error);
         return apiResponse.ErrorResponse(res, error);
    }
}


function getupdateStatement(name, description, lists_id) {
    return new Promise(function (resolve, reject) {
        let updateStatement = '';
        if (name) {
            updateStatement += `name = '${name}'`;
        }
        if (description) {
            updateStatement += (name) ? ` , description = '${description}'` : ` description = '${description}'`;
        }
        if (lists_id) {
            const check_list = `select id from ${database}.lists where id = '${lists_id}';`;

        mysqlConnection.query(check_list, (err, result) => {
                if(err) {
                    reject(err.sqlMessage);
                }
                else if (result.length == 0) {
                    reject(`List does not exists with given id: ${lists_id}`);
                }
                else if (result.length > 0) {
                    updateStatement += (name || description) ? ` , lists_id = '${lists_id}'` : ` lists_id = '${lists_id}'`;
                    resolve(updateStatement);
                }
            });
        }else {
            resolve(updateStatement);
        }
    });
  }

/**
 * Update Card
 * This method can update name / description / list_id of the card
 */
exports.updateCard = async (req, res) =>  {
    try {

    const { id, name, description, lists_id } = req.body;
    console.log('updateCard::id:: ', id);
    console.log('updateCard::name:: ', name);
    console.log('updateCard::description:: ', description);
    console.log('updateCard::lists_id:: ', lists_id);

    let updateStatement = '';
    updateStatement = await getupdateStatement(name,description,lists_id);

    if (updateStatement) {
    const sqlQuery = `Update ${database}.${tableName} set ${updateStatement} where id = ${id};`
        console.log('sqlQuery:: ', sqlQuery);
        mysqlConnection.query(sqlQuery,(err, result) => {
            if(err) {
                return apiResponse.ErrorResponse(res, err.sqlMessage);
            }
            else{
                return apiResponse.successResponseWithData(res, result);
            }
        });
    }else{
        return apiResponse.successResponse(res, 'No fields to update!');
    }

    } catch (error) {
        //throw error in json response with status 500.
        console.log('updateCard::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};

/**
 * Get cards
 * This method returns cards of specified list if given list_id
 * other wise it will return all the cards.
 */
exports.getCards = async (req,res) => {
    try {
        const { list_id } = req.body;
        let sqlQuery = `Select * from ${database}.${tableName}`;

        if(list_id){
            sqlQuery += ` where lists_id = ${list_id};`;
        }else{
            sqlQuery += ';';
        }
        console.log('getCards::sqlQuery:: ', sqlQuery);

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
        console.log('getCards::error:: ', error);
        return apiResponse.ErrorResponse(res, error);
    }
};